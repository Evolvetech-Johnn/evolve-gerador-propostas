import React, { useState } from 'react';
import {
  Phone, Globe, Star, MapPin, Instagram, Facebook, Linkedin,
  Youtube, TrendingUp, ChevronDown, ChevronUp, FileText, UserCheck, Loader2
} from 'lucide-react';
import { Lead, DadosCnpj, enriquecerCnpj } from '../services/leadsApi';
import { useProposals } from '../../../store/useProposals';
import { useNavigate } from '@tanstack/react-router';
import { todayIso } from '../../../lib/proposal';

interface Props {
  lead: Lead;
}

function ScoreBadge({ score }: { score: number }) {
  const cor =
    score >= 70 ? 'bg-green-500/15 text-green-400 border-green-500/30' :
    score >= 40 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                  'bg-red-500/15 text-red-400 border-red-500/30';
  const label = score >= 70 ? 'Alto potencial' : score >= 40 ? 'Médio potencial' : 'Baixo potencial';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cor}`}>
      <span className="text-base leading-none">{score}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export const LeadCard: React.FC<Props> = ({ lead }) => {
  const [expandMotivos, setExpandMotivos] = useState(false);
  const [expandCnpj, setExpandCnpj] = useState(false);
  const [cnpjData, setCnpjData] = useState<DadosCnpj | null>(null);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);

  const { create } = useProposals();
  const navigate = useNavigate();

  const handleGerarProposta = () => {
    const id = create({
      company: 'Evolve Marketing',
      logoDataUrl: undefined,
      accent: '#d9a94a',
      theme: 'dark-gold',
      fontPair: 'modern',
      clientName: lead.nome,
      clientCompany: lead.nome,
      offer: 'Gestão de Marketing Digital',
      proposalDate: todayIso(),
      validityDays: 15,
      consultant: '',
      consultantRole: '',
      sections: [
        { id: 'diagnostico', enabled: true },
        { id: 'metodo', enabled: true },
        { id: 'valuestack', enabled: true },
        { id: 'prova', enabled: true },
        { id: 'investimento', enabled: true },
        { id: 'fechamento', enabled: true },
      ],
      coverEyebrow: 'PROPOSTA EXCLUSIVA',
      coverHeadline: `O caminho para ${lead.nome} crescer online com resultados reais.`,
      coverSubtitle: 'Uma estratégia sob medida para o seu negócio.',
      diagnosisText: `${lead.nome}, localizado em ${lead.endereco}, tem grande potencial de crescimento digital. Com presença otimizada e estratégia certa, o resultado pode vir em 90 dias.`,
      monthlyPainCost: 0,
      methodName: 'Método Crescimento Digital',
      methodIntro: 'Uma abordagem focada em resultado, não em processo.',
      methodSteps: [],
      milestones: [],
      deliverables: [],
      bioText: '',
      bioCredentials: '',
      metricsLine: '',
      testimonials: [],
      payMode: 'mensal',
      monthlyValue: 0,
      showFromPrice: false,
      cardInstallment: 0,
      cardCount: 12,
      pixValue: 0,
      pixDiscount: 10,
      boletoInstallment: 0,
      boletoCount: 12,
      guaranteeEnabled: false,
      guaranteeText: '',
      urgencyReason: '',
      closingMessage: `Essa proposta foi desenhada sob medida para ${lead.nome}. O próximo passo é um só: confirmar de acordo abaixo.`,
      ctaText: 'VAMOS COMEÇAR',
    });
    navigate({ to: '/editor/$id', params: { id } });
  };

  const handleEnriquecerCnpj = async () => {
    if (!lead.cnpj) return;
    if (cnpjData) { setExpandCnpj(!expandCnpj); return; }
    setCnpjLoading(true);
    setCnpjError(null);
    setExpandCnpj(true);
    try {
      const data = await enriquecerCnpj(lead.cnpj);
      setCnpjData(data);
    } catch (err) {
      setCnpjError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ');
    } finally {
      setCnpjLoading(false);
    }
  };

  const redes = lead.redesSociais || {};

  return (
    <div className="paper rounded-2xl border border-gray-800 p-5 flex flex-col gap-4 hover:border-gray-700 transition-all duration-200">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate">{lead.nome}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span className="truncate">{lead.endereco}</span>
          </div>
        </div>
        <ScoreBadge score={lead.qualificacao.score} />
      </div>

      {/* Dados de contato */}
      <div className="flex flex-wrap gap-3 text-xs">
        {lead.rating != null && (
          <span className="flex items-center gap-1 text-amber-400">
            <Star size={12} fill="currentColor" />
            {lead.rating.toFixed(1)}
            <span className="text-gray-500">({lead.userRatingsTotal})</span>
          </span>
        )}
        {lead.telefone && (
          <a href={`tel:${lead.telefone}`} className="flex items-center gap-1 text-gray-300 hover:text-white transition">
            <Phone size={12} />
            {lead.telefone}
          </a>
        )}
        {lead.website && (
          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition truncate max-w-[160px]">
            <Globe size={12} />
            {lead.website.replace(/^https?:\/\//, '').split('/')[0]}
          </a>
        )}
      </div>

      {/* Redes sociais */}
      {Object.keys(redes).length > 0 && (
        <div className="flex items-center gap-2">
          {redes.instagram && (
            <a href={redes.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-pink-400 hover:text-pink-300 transition">
              <Instagram size={16} />
            </a>
          )}
          {redes.facebook && (
            <a href={redes.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="text-blue-400 hover:text-blue-300 transition">
              <Facebook size={16} />
            </a>
          )}
          {redes.linkedin && (
            <a href={redes.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-sky-400 hover:text-sky-300 transition">
              <Linkedin size={16} />
            </a>
          )}
          {redes.youtube && (
            <a href={redes.youtube} target="_blank" rel="noopener noreferrer" title="YouTube" className="text-red-400 hover:text-red-300 transition">
              <Youtube size={16} />
            </a>
          )}
        </div>
      )}

      {/* Faturamento estimado */}
      <div className="flex items-center gap-2 text-xs">
        <TrendingUp size={13} className="text-amber-400" />
        <span className="text-gray-400">Faturamento estimado:</span>
        <span className="font-semibold text-white">{fmtBRL(lead.faturamentoEstimado)}/mês</span>
      </div>

      {/* Motivos de qualificação (expansível) */}
      <div>
        <button
          onClick={() => setExpandMotivos(!expandMotivos)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
        >
          {expandMotivos ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expandMotivos ? 'Ocultar análise' : 'Ver análise de qualificação'}
        </button>
        {expandMotivos && (
          <ul className="mt-2 space-y-1">
            {lead.qualificacao.motivos.map((m, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">•</span>
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CNPJ (expansível se disponível) */}
      {lead.cnpj && (
        <div>
          <button
            onClick={handleEnriquecerCnpj}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <UserCheck size={13} />
            {cnpjLoading ? 'Consultando...' : expandCnpj ? 'Ocultar dados do CNPJ' : 'Enriquecer CNPJ'}
          </button>
          {expandCnpj && (
            <div className="mt-2 p-3 bg-gray-900 rounded-xl border border-gray-800 text-xs space-y-1.5">
              {cnpjLoading && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={13} className="animate-spin" /> Consultando ReceitaWS...
                </div>
              )}
              {cnpjError && <p className="text-red-400">{cnpjError}</p>}
              {cnpjData && !cnpjLoading && (
                <>
                  <p><span className="text-gray-500">Razão social:</span> {cnpjData.razaoSocial}</p>
                  <p><span className="text-gray-500">Situação:</span> {cnpjData.situacao}</p>
                  <p><span className="text-gray-500">Abertura:</span> {cnpjData.abertura}</p>
                  {cnpjData.atividade && <p><span className="text-gray-500">Atividade:</span> {cnpjData.atividade}</p>}
                  {cnpjData.socios.length > 0 && (
                    <div>
                      <p className="text-gray-500 mb-1">Sócios:</p>
                      {cnpjData.socios.map((s, i) => (
                        <p key={i} className="ml-2">• {s.nome} <span className="text-gray-600">({s.qualificacao})</span></p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 pt-1">
        <button
          id={`lead-gerar-proposta-${lead.placeId}`}
          onClick={handleGerarProposta}
          className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold py-2.5 rounded-xl transition-all"
        >
          <FileText size={13} />
          Gerar Proposta
        </button>
      </div>
    </div>
  );
};
