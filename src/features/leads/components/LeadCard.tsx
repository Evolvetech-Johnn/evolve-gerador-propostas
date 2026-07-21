import React, { useState } from 'react';
import {
  Phone, Globe, Star, MapPin, Instagram, Facebook, Linkedin,
  Youtube, TrendingUp, ChevronDown, ChevronUp, FileText,
  UserCheck, Loader2, AlertTriangle, AlertOctagon, Info, ShieldCheck,
  Zap, ArrowRight
} from 'lucide-react';
import { Lead, NivelRisco, DadosCnpj, enriquecerCnpj } from '../services/leadsApi';
import { useProposals } from '../../../store/useProposals';
import { useNavigate } from '@tanstack/react-router';
import { todayIso } from '../../../lib/proposal';

interface Props {
  lead: Lead;
}

// ─── Configuração visual por nível de risco ──────────────────────────────────
const RISCO_CONFIG: Record<NivelRisco, {
  icon: React.ElementType;
  cor: string;
  corBorda: string;
  corBg: string;
  corTexto: string;
  corBadgeBg: string;
  emoji: string;
}> = {
  critico: {
    icon: AlertOctagon,
    cor: 'text-red-400',
    corBorda: 'border-red-500/40',
    corBg: 'bg-red-500/8',
    corTexto: 'text-red-300',
    corBadgeBg: 'bg-red-500/15 border-red-500/30',
    emoji: '🔴',
  },
  alto: {
    icon: AlertTriangle,
    cor: 'text-orange-400',
    corBorda: 'border-orange-500/40',
    corBg: 'bg-orange-500/8',
    corTexto: 'text-orange-300',
    corBadgeBg: 'bg-orange-500/15 border-orange-500/30',
    emoji: '🟠',
  },
  medio: {
    icon: Info,
    cor: 'text-yellow-400',
    corBorda: 'border-yellow-500/30',
    corBg: 'bg-yellow-500/6',
    corTexto: 'text-yellow-300',
    corBadgeBg: 'bg-yellow-500/15 border-yellow-500/30',
    emoji: '🟡',
  },
  baixo: {
    icon: ShieldCheck,
    cor: 'text-green-400',
    corBorda: 'border-green-500/30',
    corBg: 'bg-green-500/6',
    corTexto: 'text-green-300',
    corBadgeBg: 'bg-green-500/15 border-green-500/30',
    emoji: '🟢',
  },
};

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function ScoreBadge({ score }: { score: number }) {
  const cor =
    score >= 70 ? 'bg-green-500/15 text-green-400 border-green-500/30' :
    score >= 40 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                  'bg-red-500/15 text-red-400 border-red-500/30';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${cor}`}>
      <Star size={9} fill="currentColor" /> {score}
    </span>
  );
}

export const LeadCard: React.FC<Props> = ({ lead }) => {
  const [expandRisco, setExpandRisco] = useState(true);
  const [expandCnpj, setExpandCnpj] = useState(false);
  const [cnpjData, setCnpjData] = useState<DadosCnpj | null>(null);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);

  const { create } = useProposals();
  const navigate = useNavigate();

  const risco = lead.risco;
  const riscoConfig = RISCO_CONFIG[risco.nivel];
  const RiscoIcon = riscoConfig.icon;
  const redes = lead.redesSociais || {};

  const handleGerarProposta = () => {
    // Monta texto de diagnóstico a partir das lacunas de risco
    const lacunasTexto = risco.lacunas.slice(0, 3).map(l => l.titulo).join(', ');
    const diagnosisText = `${lead.nome} apresenta lacunas digitais que comprometem sua captação de clientes: ${lacunasTexto}. ${risco.urgencia}`;

    const id = create({
      company: 'Evolve Marketing',
      logoDataUrl: undefined,
      accent: '#d9a94a',
      theme: 'dark-gold',
      fontPair: 'modern',
      clientName: lead.nome,
      clientCompany: lead.nome,
      offer: 'Presença Digital Completa',
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
      coverEyebrow: 'DIAGNÓSTICO DIGITAL',
      coverHeadline: `O caminho para ${lead.nome} dominar o digital e atrair mais clientes.`,
      coverSubtitle: risco.descricao,
      diagnosisText,
      monthlyPainCost: 0,
      methodName: 'Método Presença 360°',
      methodIntro: 'Atacamos todas as lacunas digitais de forma estratégica e sequencial para resultados rápidos e duradouros.',
      methodSteps: risco.lacunas.slice(0, 4).map(l => ({ id: crypto.randomUUID(), title: l.servico })),
      milestones: [],
      // Pré-preenche deliverables com os serviços recomendados para as lacunas
      deliverables: risco.lacunas.map(l => ({
        id: crypto.randomUUID(),
        title: l.servico,
        desc: `${l.descricao} ${l.impacto}`,
        value: 0,
        bonus: false,
      })),
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
      urgencyReason: risco.urgencia,
      closingMessage: `Essa proposta foi desenhada sob medida para ${lead.nome}. O próximo passo é um só: confirmar de acordo abaixo.`,
      ctaText: 'RESOLVER ISSO AGORA',
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

  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-200 paper ${riscoConfig.corBorda}`}>

      {/* ── Cabeçalho ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight">{lead.nome}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span className="truncate">{lead.endereco}</span>
          </div>
        </div>
        <ScoreBadge score={lead.qualificacao.score} />
      </div>

      {/* ── Badge de nível de risco (destaque principal) ─────────────────── */}
      <div className={`rounded-xl border px-3 py-2.5 ${riscoConfig.corBadgeBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiscoIcon size={15} className={riscoConfig.cor} />
            <span className={`text-sm font-bold ${riscoConfig.cor}`}>
              {riscoConfig.emoji} {risco.titulo}
            </span>
            <span className={`text-xs ${riscoConfig.corTexto} opacity-75`}>
              — {risco.lacunas.length} lacuna{risco.lacunas.length !== 1 ? 's' : ''} detectada{risco.lacunas.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={() => setExpandRisco(!expandRisco)}
            className="text-gray-500 hover:text-gray-300 transition"
          >
            {expandRisco ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Urgência */}
        {expandRisco && (
          <div className="mt-2 space-y-3">
            <p className={`text-xs leading-relaxed ${riscoConfig.corTexto}`}>
              {risco.urgencia}
            </p>

            {/* Lista de lacunas */}
            {risco.lacunas.length > 0 && (
              <div className="space-y-2">
                {risco.lacunas.map((lacuna) => (
                  <div key={lacuna.id} className="bg-black/20 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{lacuna.titulo}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riscoConfig.corBadgeBg} ${riscoConfig.cor}`}>
                        -{lacuna.peso}pts
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{lacuna.impacto}</p>
                    <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-medium ${riscoConfig.cor}`}>
                      <ArrowRight size={9} />
                      Solução: {lacuna.servico}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Dados de contato ──────────────────────────────────────────────── */}
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
          <a href={lead.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition truncate max-w-[160px]">
            <Globe size={12} />
            {lead.website.replace(/^https?:\/\//, '').split('/')[0]}
          </a>
        )}
      </div>

      {/* ── Redes sociais ─────────────────────────────────────────────────── */}
      {Object.keys(redes).length > 0 && (
        <div className="flex items-center gap-3">
          {redes.instagram && <a href={redes.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-pink-400 hover:text-pink-300 transition"><Instagram size={15} /></a>}
          {redes.facebook  && <a href={redes.facebook}  target="_blank" rel="noopener noreferrer" title="Facebook"  className="text-blue-400 hover:text-blue-300 transition"><Facebook  size={15} /></a>}
          {redes.linkedin  && <a href={redes.linkedin}  target="_blank" rel="noopener noreferrer" title="LinkedIn"  className="text-sky-400  hover:text-sky-300  transition"><Linkedin  size={15} /></a>}
          {redes.youtube   && <a href={redes.youtube}   target="_blank" rel="noopener noreferrer" title="YouTube"   className="text-red-400  hover:text-red-300  transition"><Youtube   size={15} /></a>}
        </div>
      )}

      {/* ── Faturamento estimado ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs">
        <TrendingUp size={13} className="text-amber-400" />
        <span className="text-gray-400">Faturamento estimado:</span>
        <span className="font-semibold">{fmtBRL(lead.faturamentoEstimado)}/mês</span>
      </div>

      {/* ── CNPJ expansível ──────────────────────────────────────────────── */}
      {lead.cnpj && (
        <div>
          <button onClick={handleEnriquecerCnpj} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition">
            <UserCheck size={13} />
            {cnpjLoading ? 'Consultando...' : expandCnpj ? 'Ocultar dados CNPJ' : 'Enriquecer CNPJ'}
          </button>
          {expandCnpj && (
            <div className="mt-2 p-3 bg-gray-900 rounded-xl border border-gray-800 text-xs space-y-1.5">
              {cnpjLoading && <div className="flex items-center gap-2 text-gray-400"><Loader2 size={13} className="animate-spin" /> Consultando...</div>}
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

      {/* ── Ação principal ────────────────────────────────────────────────── */}
      <button
        id={`lead-gerar-proposta-${lead.placeId}`}
        onClick={handleGerarProposta}
        className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all ${
          risco.nivel === 'critico'
            ? 'bg-red-500 hover:bg-red-400 text-white'
            : risco.nivel === 'alto'
            ? 'bg-orange-500 hover:bg-orange-400 text-white'
            : 'bg-amber-500 hover:bg-amber-400 text-black'
        }`}
      >
        <Zap size={14} />
        Gerar Proposta
        {(risco.nivel === 'critico' || risco.nivel === 'alto') && (
          <span className="text-[10px] font-normal opacity-80 ml-1">— com diagnóstico de risco</span>
        )}
        <FileText size={13} />
      </button>
    </div>
  );
};
