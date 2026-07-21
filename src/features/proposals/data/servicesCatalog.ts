/**
 * servicesCatalog.ts
 * Catálogo estático de serviços oferecidos.
 * Para adicionar/editar serviços, modifique este arquivo diretamente.
 * Os itens selecionados na proposta alimentam o array `deliverables`.
 */

export interface CatalogItem {
  id: string;
  nome: string;
  categoria: string;
  desc: string;
  valorSugerido: number;
  bonus?: boolean;
}

export const servicesCatalog: CatalogItem[] = [
  // ── Redes Sociais ────────────────────────────────────────────────────────
  {
    id: 'gestao-redes-sociais',
    nome: 'Gestão de Redes Sociais',
    categoria: 'Redes Sociais',
    desc: 'Planejamento, criação e publicação de conteúdo mensal no Instagram, Facebook e/ou LinkedIn.',
    valorSugerido: 2500,
  },
  {
    id: 'criacao-conteudo',
    nome: 'Criação de Conteúdo (Feed + Stories)',
    categoria: 'Redes Sociais',
    desc: 'Produção de posts para feed e stories, com identidade visual e copy persuasiva.',
    valorSugerido: 1800,
  },
  {
    id: 'reels-tiktok',
    nome: 'Produção de Reels / TikTok',
    categoria: 'Redes Sociais',
    desc: 'Roteiro, gravação e edição de vídeos curtos para reels e TikTok.',
    valorSugerido: 2200,
  },

  // ── Tráfego Pago ─────────────────────────────────────────────────────────
  {
    id: 'gestao-trafego-meta',
    nome: 'Gestão de Tráfego Pago — Meta Ads',
    categoria: 'Tráfego Pago',
    desc: 'Criação, segmentação e otimização de campanhas no Facebook e Instagram Ads.',
    valorSugerido: 3000,
  },
  {
    id: 'gestao-trafego-google',
    nome: 'Gestão de Tráfego Pago — Google Ads',
    categoria: 'Tráfego Pago',
    desc: 'Campanhas de pesquisa, display e remarketing no Google Ads com otimização semanal.',
    valorSugerido: 3500,
  },
  {
    id: 'auditoria-trafego',
    nome: 'Auditoria de Contas de Anúncios',
    categoria: 'Tráfego Pago',
    desc: 'Análise completa de contas existentes com relatório de oportunidades e gargalos.',
    valorSugerido: 2000,
    bonus: false,
  },

  // ── Web ──────────────────────────────────────────────────────────────────
  {
    id: 'criacao-site',
    nome: 'Criação de Site Institucional',
    categoria: 'Web',
    desc: 'Desenvolvimento de site responsivo, otimizado para SEO e conversão.',
    valorSugerido: 6000,
  },
  {
    id: 'landing-page',
    nome: 'Landing Page de Alta Conversão',
    categoria: 'Web',
    desc: 'Página focada em captura de leads ou vendas, com copy e design orientados à conversão.',
    valorSugerido: 3500,
  },
  {
    id: 'manutencao-site',
    nome: 'Manutenção Mensal de Site',
    categoria: 'Web',
    desc: 'Atualizações, backups, segurança e suporte técnico mensal.',
    valorSugerido: 800,
  },

  // ── Conteúdo / Copy ──────────────────────────────────────────────────────
  {
    id: 'copywriting',
    nome: 'Copywriting — Textos Persuasivos',
    categoria: 'Conteúdo',
    desc: 'Produção de textos de vendas para landing pages, e-mails, anúncios e redes sociais.',
    valorSugerido: 2000,
  },
  {
    id: 'email-marketing',
    nome: 'E-mail Marketing',
    categoria: 'Conteúdo',
    desc: 'Criação e disparo de campanhas de e-mail para nutrição de leads e vendas.',
    valorSugerido: 1500,
  },

  // ── Design ───────────────────────────────────────────────────────────────
  {
    id: 'identidade-visual',
    nome: 'Identidade Visual',
    categoria: 'Design',
    desc: 'Criação de logotipo, paleta de cores, tipografia e manual de marca.',
    valorSugerido: 4500,
  },
  {
    id: 'fotografia-produto',
    nome: 'Fotografia de Produto / Estabelecimento',
    categoria: 'Design',
    desc: 'Sessão fotográfica profissional para produtos, espaço físico e equipe.',
    valorSugerido: 2500,
  },

  // ── Consultoria ──────────────────────────────────────────────────────────
  {
    id: 'consultoria-marketing',
    nome: 'Consultoria de Marketing Digital',
    categoria: 'Consultoria',
    desc: 'Diagnóstico e planejamento estratégico de marketing com sessões mensais de acompanhamento.',
    valorSugerido: 3000,
  },
  {
    id: 'relatorio-performance',
    nome: 'Relatório Mensal de Performance',
    categoria: 'Consultoria',
    desc: 'Relatório detalhado com métricas, insights e recomendações estratégicas.',
    valorSugerido: 500,
    bonus: true,
  },
];

/** Agrupa o catálogo por categoria */
export function agruparPorCategoria(catalog: CatalogItem[]): Record<string, CatalogItem[]> {
  return catalog.reduce<Record<string, CatalogItem[]>>((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});
}
