/**
 * leadsApi.ts
 * Funções puras de chamada à API de leads.
 * Sem lógica de UI, sem estado — apenas fetch e tipagem.
 */

const API_BASE = 'http://localhost:3333/api/leads';

export interface BuscarLeadsParams {
  nicho: string;
  cidade: string;
  estado: string;
  avaliacaoMinima?: number;
  minimoAvaliacoes?: number;
  exigirTelefone?: boolean;
  exigirSite?: boolean;
}

export interface RedesSociais {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface Qualificacao {
  score: number;
  motivos: string[];
}

export interface Lacuna {
  id: string;
  titulo: string;
  descricao: string;
  impacto: string;
  servico: string;
  peso: number;
}

export type NivelRisco = 'critico' | 'alto' | 'medio' | 'baixo';

export interface Risco {
  nivel: NivelRisco;
  titulo: string;
  descricao: string;
  pontosPerdidos: number;
  lacunas: Lacuna[];
  urgencia: string;
}

export interface Lead {
  placeId: string;
  nome: string;
  endereco: string;
  telefone: string | null;
  website: string | null;
  rating: number | null;
  userRatingsTotal: number;
  tipos: string[];
  faturamentoEstimado: number;
  redesSociais: RedesSociais;
  qualificacao: Qualificacao;
  risco: Risco;
  cnpj?: string;
  fonte: 'google_places' | 'nominatim';
}

export interface BuscarLeadsResponse {
  leads: Lead[];
  total: number;
  fonte: 'google_places' | 'nominatim';
}

export interface DadosCnpj {
  razaoSocial: string;
  nomeFantasia: string;
  situacao: string;
  abertura: string;
  atividade: string;
  socios: { nome: string; qualificacao: string }[];
  endereco: string;
  email: string;
  telefone: string;
  capital: string;
}

export async function buscarLeads(params: BuscarLeadsParams): Promise<BuscarLeadsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('nicho', params.nicho);
  searchParams.set('cidade', params.cidade);
  searchParams.set('estado', params.estado);
  if (params.avaliacaoMinima != null) searchParams.set('avaliacaoMinima', String(params.avaliacaoMinima));
  if (params.minimoAvaliacoes != null) searchParams.set('minimoAvaliacoes', String(params.minimoAvaliacoes));
  searchParams.set('exigirTelefone', String(params.exigirTelefone ?? true));
  searchParams.set('exigirSite', String(params.exigirSite ?? false));

  const res = await fetch(`${API_BASE}/buscar?${searchParams.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { erro?: string }).erro || `Erro ${res.status}`);
  }
  return res.json();
}

export async function enriquecerCnpj(cnpj: string): Promise<DadosCnpj> {
  const res = await fetch(`${API_BASE}/enriquecer-cnpj`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cnpj }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { erro?: string }).erro || `Erro ${res.status}`);
  }
  return res.json();
}
