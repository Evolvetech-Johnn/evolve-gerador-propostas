/**
 * scoring.service.js
 * Calcula o score de qualificação (0–100), a classificação de risco digital
 * e estima o faturamento mensal. Isolado de UI e HTTP.
 */

// ─── Mapeamento de tipos de nicho → presença digital esperada ───────────────
const NICHO_EXPECTATIVAS = {
  restaurante:   { precisaSite: false, precisaRedes: true,  precisaFotos: true  },
  lanchonete:    { precisaSite: false, precisaRedes: true,  precisaFotos: true  },
  pizzaria:      { precisaSite: true,  precisaRedes: true,  precisaFotos: true  },
  academia:      { precisaSite: true,  precisaRedes: true,  precisaFotos: false },
  salao:         { precisaSite: false, precisaRedes: true,  precisaFotos: true  },
  clinica:       { precisaSite: true,  precisaRedes: true,  precisaFotos: false },
  consultorio:   { precisaSite: true,  precisaRedes: false, precisaFotos: false },
  advogado:      { precisaSite: true,  precisaRedes: false, precisaFotos: false },
  imobiliaria:   { precisaSite: true,  precisaRedes: true,  precisaFotos: true  },
  hotel:         { precisaSite: true,  precisaRedes: true,  precisaFotos: true  },
  pousada:       { precisaSite: true,  precisaRedes: true,  precisaFotos: true  },
  farmacia:      { precisaSite: false, precisaRedes: false, precisaFotos: false },
  supermercado:  { precisaSite: false, precisaRedes: false, precisaFotos: false },
  loja:          { precisaSite: true,  precisaRedes: true,  precisaFotos: true  },
  ecommerce:     { precisaSite: true,  precisaRedes: true,  precisaFotos: true  },
  default:       { precisaSite: true,  precisaRedes: true,  precisaFotos: false },
};

/**
 * Detecta a expectativa digital para o nicho pesquisado.
 */
function expectativaPorNicho(nicho = '') {
  const n = nicho.toLowerCase();
  for (const [chave, expectativa] of Object.entries(NICHO_EXPECTATIVAS)) {
    if (n.includes(chave)) return expectativa;
  }
  return NICHO_EXPECTATIVAS.default;
}

// ─── Lacunas digitais definidas ───────────────────────────────────────────────
const LACUNAS = {
  SEM_SITE: {
    id: 'sem_site',
    titulo: 'Sem site',
    descricao: 'Não possui presença no Google com site próprio.',
    impacto: 'Clientes que pesquisam online não encontram o negócio.',
    servico: 'Criação de Site ou Landing Page',
    peso: 30,
  },
  SEM_REDES: {
    id: 'sem_redes',
    titulo: 'Sem redes sociais identificadas',
    descricao: 'Nenhuma rede social foi encontrada no site ou perfil.',
    impacto: 'Zero engajamento digital — invisível para quem busca nas redes.',
    servico: 'Gestão de Redes Sociais',
    peso: 25,
  },
  REDES_INCOMPLETAS: {
    id: 'redes_incompletas',
    titulo: 'Presença social incompleta',
    descricao: 'Apenas 1 rede social identificada.',
    impacto: 'Alcance limitado — deixando audiência em outras plataformas.',
    servico: 'Expansão de Redes Sociais + Gestão de Conteúdo',
    peso: 12,
  },
  SEM_TRAFEGO: {
    id: 'sem_trafego',
    titulo: 'Sem estratégia de tráfego pago',
    descricao: 'Negócio depende apenas de busca orgânica e boca-a-boca.',
    impacto: 'Crescimento lento, vulnerável a concorrência com anúncios.',
    servico: 'Gestão de Tráfego Pago (Meta Ads / Google Ads)',
    peso: 20,
  },
  REPUTACAO_FRAGIL: {
    id: 'reputacao_fragil',
    titulo: 'Reputação digital fraca',
    descricao: 'Rating abaixo de 3.5★ ou sem avaliações suficientes.',
    impacto: 'Avaliações ruins afastam clientes antes mesmo do primeiro contato.',
    servico: 'Gestão de Reputação + Estratégia de Reviews',
    peso: 20,
  },
  POUCAS_AVALIACOES: {
    id: 'poucas_avaliacoes',
    titulo: 'Pouca autoridade no Google',
    descricao: 'Menos de 20 avaliações no Google Meu Negócio.',
    impacto: 'Baixo ranqueamento local — concorrentes aparecem antes.',
    servico: 'Otimização de Google Meu Negócio + SEO Local',
    peso: 15,
  },
  SEM_TELEFONE: {
    id: 'sem_telefone',
    titulo: 'Sem telefone de contato visível',
    descricao: 'Número de telefone não está cadastrado no Google.',
    impacto: 'Clientes não conseguem entrar em contato — perda direta de conversões.',
    servico: 'Auditoria e Otimização de Presença Digital',
    peso: 10,
  },
};

/**
 * Estima o faturamento mensal aproximado com base em dados disponíveis.
 */
export function estimarFaturamento(lead) {
  const { rating = 0, userRatingsTotal = 0, tipos = [] } = lead;

  const baseMultiplier = tipos.includes('restaurant') ? 80000
    : tipos.includes('hotel')                         ? 150000
    : tipos.includes('beauty_salon') || tipos.includes('hair_care') ? 30000
    : tipos.includes('gym') || tipos.includes('health')             ? 40000
    : tipos.includes('store') || tipos.includes('shopping_mall')    ? 60000
    : 35000;

  const popularidade = Math.min(userRatingsTotal / 500, 1);
  const qualidade = rating / 5;
  const fator = 0.4 + popularidade * 0.4 + qualidade * 0.2;

  return Math.round(baseMultiplier * fator);
}

/**
 * Calcula o score de qualificação do lead (0-100).
 */
export function calcularScore(lead) {
  let score = 0;
  const motivos = [];

  const {
    rating = 0,
    userRatingsTotal = 0,
    telefone,
    website,
    redesSociais = {},
    faturamentoEstimado = 0,
  } = lead;

  if (rating >= 4.5)      { score += 30; motivos.push('Excelente avaliação no Google (≥4.5★)'); }
  else if (rating >= 4.0) { score += 20; motivos.push('Boa avaliação no Google (≥4.0★)'); }
  else if (rating >= 3.5) { score += 10; motivos.push('Avaliação razoável no Google (≥3.5★)'); }
  else if (rating > 0)    {              motivos.push('Avaliação baixa no Google (<3.5★)'); }

  if (userRatingsTotal >= 200)      { score += 20; motivos.push('Alto volume de avaliações (≥200)'); }
  else if (userRatingsTotal >= 50)  { score += 12; motivos.push('Volume médio de avaliações (≥50)'); }
  else if (userRatingsTotal >= 10)  { score += 5;  motivos.push('Poucas avaliações (<50)'); }
  else                              {              motivos.push('Quase sem avaliações no Google'); }

  if (telefone)  { score += 15; motivos.push('Telefone disponível para contato'); }
  else           {              motivos.push('Sem telefone cadastrado'); }

  if (website)   { score += 15; motivos.push('Possui site — possível cliente para redesign ou anúncios'); }
  else           { score += 5;  motivos.push('Sem site — oportunidade de criação de presença digital'); }

  const redesEncontradas = Object.values(redesSociais).filter(Boolean).length;
  if (redesEncontradas >= 2)     { score += 15; motivos.push(`${redesEncontradas} redes sociais encontradas`); }
  else if (redesEncontradas === 1) { score += 8; motivos.push('1 rede social encontrada'); }
  else                            {              motivos.push('Sem redes sociais identificadas'); }

  if (faturamentoEstimado >= 50000)      { score += 5; motivos.push('Faturamento estimado alto (≥R$50k/mês)'); }
  else if (faturamentoEstimado >= 20000) { score += 3; motivos.push('Faturamento estimado médio (≥R$20k/mês)'); }

  return { score: Math.min(score, 100), motivos };
}

/**
 * Classifica o risco digital do lead com base nas lacunas de presença.
 * Retorna nível, descrição, lacunas detectadas e urgência para contratar.
 *
 * @param {object} lead - Lead enriquecido com redesSociais e faturamentoEstimado
 * @param {string} nicho - Nicho pesquisado (ex: "academia", "salão de beleza")
 * @returns {{
 *   nivel: 'critico' | 'alto' | 'medio' | 'baixo',
 *   titulo: string,
 *   descricao: string,
 *   pontosPerdidos: number,
 *   lacunas: Array<{ id, titulo, descricao, impacto, servico, peso }>,
 *   urgencia: string
 * }}
 */
export function calcularRiscoDigital(lead, nicho = '') {
  const {
    rating = 0,
    userRatingsTotal = 0,
    telefone,
    website,
    redesSociais = {},
  } = lead;

  const expectativa = expectativaPorNicho(nicho);
  const lacunasDetectadas = [];
  let pontosPerdidos = 0;

  // Avalia cada lacuna possível
  if (!website && expectativa.precisaSite) {
    lacunasDetectadas.push(LACUNAS.SEM_SITE);
    pontosPerdidos += LACUNAS.SEM_SITE.peso;
  } else if (!website) {
    lacunasDetectadas.push({ ...LACUNAS.SEM_SITE, peso: Math.round(LACUNAS.SEM_SITE.peso * 0.6) });
    pontosPerdidos += Math.round(LACUNAS.SEM_SITE.peso * 0.6);
  }

  const redesEncontradas = Object.values(redesSociais).filter(Boolean).length;
  if (redesEncontradas === 0 && expectativa.precisaRedes) {
    lacunasDetectadas.push(LACUNAS.SEM_REDES);
    pontosPerdidos += LACUNAS.SEM_REDES.peso;
  } else if (redesEncontradas === 0) {
    lacunasDetectadas.push({ ...LACUNAS.SEM_REDES, peso: Math.round(LACUNAS.SEM_REDES.peso * 0.7) });
    pontosPerdidos += Math.round(LACUNAS.SEM_REDES.peso * 0.7);
  } else if (redesEncontradas === 1) {
    lacunasDetectadas.push(LACUNAS.REDES_INCOMPLETAS);
    pontosPerdidos += LACUNAS.REDES_INCOMPLETAS.peso;
  }

  // Sem tráfego pago: inferido por ausência de site + redes fracas
  if (!website || redesEncontradas === 0) {
    lacunasDetectadas.push(LACUNAS.SEM_TRAFEGO);
    pontosPerdidos += LACUNAS.SEM_TRAFEGO.peso;
  }

  if (rating > 0 && rating < 3.5) {
    lacunasDetectadas.push(LACUNAS.REPUTACAO_FRAGIL);
    pontosPerdidos += LACUNAS.REPUTACAO_FRAGIL.peso;
  } else if (rating === 0) {
    lacunasDetectadas.push({ ...LACUNAS.REPUTACAO_FRAGIL, descricao: 'Nenhuma avaliação encontrada no Google.' });
    pontosPerdidos += Math.round(LACUNAS.REPUTACAO_FRAGIL.peso * 0.8);
  }

  if (userRatingsTotal < 20) {
    lacunasDetectadas.push(LACUNAS.POUCAS_AVALIACOES);
    pontosPerdidos += LACUNAS.POUCAS_AVALIACOES.peso;
  }

  if (!telefone) {
    lacunasDetectadas.push(LACUNAS.SEM_TELEFONE);
    pontosPerdidos += LACUNAS.SEM_TELEFONE.peso;
  }

  // Remove duplicados (mesmo id)
  const lacunasUnicas = lacunasDetectadas.filter(
    (l, i, arr) => arr.findIndex((x) => x.id === l.id) === i
  );

  // Ordena por peso (mais crítico primeiro)
  lacunasUnicas.sort((a, b) => b.peso - a.peso);

  // Determina nível de risco
  let nivel, titulo, descricao, urgencia;
  if (lacunasUnicas.length >= 4 || pontosPerdidos >= 70) {
    nivel = 'critico';
    titulo = 'Risco Crítico';
    descricao = 'Presença digital praticamente inexistente. Máxima oportunidade de atuação.';
    urgencia = 'Esse negócio está perdendo clientes agora. Cada dia sem presença digital é receita na mão do concorrente. Abordagem imediata recomendada.';
  } else if (lacunasUnicas.length >= 2 || pontosPerdidos >= 40) {
    nivel = 'alto';
    titulo = 'Risco Alto';
    descricao = 'Lacunas significativas comprometendo crescimento e captação de clientes.';
    urgencia = 'Lacunas identificadas estão limitando o potencial do negócio. Alta receptividade esperada para uma solução completa.';
  } else if (lacunasUnicas.length >= 1 || pontosPerdidos >= 15) {
    nivel = 'medio';
    titulo = 'Risco Médio';
    descricao = 'Presença básica existe, mas há espaço claro para otimização.';
    urgencia = 'O negócio tem base, mas concorrentes com presença digital completa saem na frente. Oportunidade de otimização com retorno rápido.';
  } else {
    nivel = 'baixo';
    titulo = 'Risco Baixo';
    descricao = 'Boa presença digital. Foco em otimização e escala.';
    urgencia = 'Negócio já tem presença digital, mas pode evoluir com tráfego pago e otimização de conteúdo para escalar resultados.';
  }

  return { nivel, titulo, descricao, pontosPerdidos, lacunas: lacunasUnicas, urgencia };
}
