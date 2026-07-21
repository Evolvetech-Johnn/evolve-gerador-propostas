/**
 * leads.controller.js
 * Orquestra: tenta Google Places → fallback Nominatim → scraping → scoring.
 * Delega lógica de negócio para os services — este arquivo apenas coordena.
 */
import axios from 'axios';
import { buscarEstabelecimentos as buscarGoogle } from '../services/googlePlaces.service.js';
import { buscarEstabelecimentos as buscarNominatim } from '../services/nominatim.service.js';
import { scraparRedesSociais } from '../services/scraping.service.js';
import { calcularScore, estimarFaturamento, calcularRiscoDigital } from '../services/scoring.service.js';
import pLimit from 'p-limit';

// Máximo de scraping paralelo para não sobrecarregar
const scrapingLimiter = pLimit(3);

/**
 * GET /api/leads/buscar
 */
export async function buscarLeads(req, res) {
  const {
    nicho,
    cidade,
    estado,
    avaliacaoMinima,
    minimoAvaliacoes,
    exigirTelefone = 'true',
    exigirSite = 'false',
  } = req.query;

  if (!nicho || !cidade || !estado) {
    return res.status(400).json({
      erro: 'Parâmetros obrigatórios ausentes: nicho, cidade, estado',
    });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  let leads = [];
  let fonte = 'nominatim';

  // 1. Tenta Google Places se a key estiver disponível
  if (apiKey) {
    try {
      leads = await buscarGoogle({ nicho, cidade, estado, apiKey });
      fonte = 'google_places';
    } catch (err) {
      console.warn('[controller] Google Places falhou, usando Nominatim:', err.message);
    }
  }

  // 2. Fallback para Nominatim se Google não retornou resultados
  if (leads.length === 0) {
    leads = await buscarNominatim({ nicho, cidade, estado });
    fonte = 'nominatim';
  }

  // 3. Scraping de redes sociais (paralelo, limitado)
  leads = await Promise.all(
    leads.map((lead) =>
      scrapingLimiter(async () => {
        const redesSociais = await scraparRedesSociais(lead.website);
        return { ...lead, redesSociais };
      })
    )
  );

  // 4. Estimar faturamento, calcular score e classificar risco digital
  leads = leads.map((lead) => {
    const faturamentoEstimado = estimarFaturamento(lead);
    const qualificacao = calcularScore({ ...lead, faturamentoEstimado });
    const risco = calcularRiscoDigital({ ...lead, faturamentoEstimado }, nicho);
    return { ...lead, faturamentoEstimado, qualificacao, risco };
  });

  // 5. Filtros opcionais
  if (avaliacaoMinima) {
    const min = parseFloat(avaliacaoMinima);
    leads = leads.filter((l) => l.rating == null || l.rating >= min);
  }
  if (minimoAvaliacoes) {
    const min = parseInt(minimoAvaliacoes);
    leads = leads.filter((l) => l.userRatingsTotal >= min);
  }
  if (exigirTelefone === 'true') {
    leads = leads.filter((l) => l.telefone);
  }
  if (exigirSite === 'true') {
    leads = leads.filter((l) => l.website);
  }

  // 6. Ordena por pontos de risco perdidos decrescente (maior risco = maior oportunidade primeiro)
  leads.sort((a, b) => b.risco.pontosPerdidos - a.risco.pontosPerdidos);

  res.json({ leads, total: leads.length, fonte });
}

/**
 * POST /api/leads/enriquecer-cnpj
 * body: { cnpj: string }
 */
export async function enriquecerCnpj(req, res) {
  const { cnpj } = req.body;
  if (!cnpj) {
    return res.status(400).json({ erro: 'CNPJ obrigatório no body' });
  }

  const cnpjLimpo = cnpj.replace(/\D/g, '');
  if (cnpjLimpo.length !== 14) {
    return res.status(400).json({ erro: 'CNPJ inválido (deve ter 14 dígitos)' });
  }

  try {
    const { data } = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
      timeout: 15000,
      headers: { 'User-Agent': 'EvolveGeradorPropostas/1.0' },
    });

    if (data.status === 'ERROR') {
      return res.status(404).json({ erro: data.message || 'CNPJ não encontrado' });
    }

    res.json({
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia,
      situacao: data.situacao,
      abertura: data.abertura,
      atividade: data.atividade_principal?.[0]?.text,
      socios: (data.qsa || []).map((s) => ({
        nome: s.nome,
        qualificacao: s.qual,
      })),
      endereco: `${data.logradouro}, ${data.numero} — ${data.municipio}/${data.uf}`,
      email: data.email,
      telefone: data.telefone,
      capital: data.capital_social,
    });
  } catch (err) {
    res.status(502).json({
      erro: 'Falha ao consultar ReceitaWS. Tente novamente em instantes.',
      detalhe: err.message,
    });
  }
}
