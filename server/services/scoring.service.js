/**
 * scoring.service.js
 * Calcula o score de qualificação de um lead (0–100) e lista os motivos.
 * Isolado de qualquer lógica de UI ou chamada HTTP.
 */

/**
 * Estima o faturamento mensal aproximado com base em dados disponíveis.
 * @param {object} lead - Dados brutos do lead
 * @returns {number} Estimativa em R$
 */
export function estimarFaturamento(lead) {
  const { rating = 0, userRatingsTotal = 0, tipos = [] } = lead;

  // Heurística simples baseada em popularidade e categoria
  const baseMultiplier = tipos.includes('restaurant')
    ? 80000
    : tipos.includes('hotel')
    ? 150000
    : tipos.includes('beauty_salon') || tipos.includes('hair_care')
    ? 30000
    : tipos.includes('gym') || tipos.includes('health')
    ? 40000
    : tipos.includes('store') || tipos.includes('shopping_mall')
    ? 60000
    : 35000;

  // Quanto mais avaliações e melhor o rating, maior o faturamento estimado
  const popularidade = Math.min(userRatingsTotal / 500, 1); // normaliza a 0-1
  const qualidade = rating / 5;
  const fator = 0.4 + popularidade * 0.4 + qualidade * 0.2;

  return Math.round(baseMultiplier * fator);
}

/**
 * Calcula o score de qualificação do lead (0-100).
 * @param {object} lead - Lead normalizado com todos os campos disponíveis
 * @returns {{ score: number, motivos: string[] }}
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

  // Rating (até 30 pontos)
  if (rating >= 4.5) {
    score += 30;
    motivos.push('Excelente avaliação no Google (≥4.5★)');
  } else if (rating >= 4.0) {
    score += 20;
    motivos.push('Boa avaliação no Google (≥4.0★)');
  } else if (rating >= 3.5) {
    score += 10;
    motivos.push('Avaliação razoável no Google (≥3.5★)');
  } else if (rating > 0) {
    motivos.push('Avaliação baixa no Google (<3.5★)');
  }

  // Volume de avaliações (até 20 pontos)
  if (userRatingsTotal >= 200) {
    score += 20;
    motivos.push('Alto volume de avaliações (≥200)');
  } else if (userRatingsTotal >= 50) {
    score += 12;
    motivos.push('Volume médio de avaliações (≥50)');
  } else if (userRatingsTotal >= 10) {
    score += 5;
    motivos.push('Poucos avaliações (<50)');
  } else {
    motivos.push('Quase sem avaliações no Google');
  }

  // Telefone (15 pontos)
  if (telefone) {
    score += 15;
    motivos.push('Telefone disponível para contato');
  } else {
    motivos.push('Sem telefone cadastrado');
  }

  // Website (15 pontos)
  if (website) {
    score += 15;
    motivos.push('Possui site — possível cliente para redesign ou anúncios');
  } else {
    score += 5; // sem site também é oportunidade
    motivos.push('Sem site — oportunidade de criação de presença digital');
  }

  // Redes sociais (até 15 pontos)
  const redesEncontradas = Object.values(redesSociais).filter(Boolean).length;
  if (redesEncontradas >= 2) {
    score += 15;
    motivos.push(`${redesEncontradas} redes sociais encontradas`);
  } else if (redesEncontradas === 1) {
    score += 8;
    motivos.push('1 rede social encontrada');
  } else {
    motivos.push('Sem redes sociais identificadas — oportunidade de gestão de mídias');
  }

  // Faturamento estimado (até 5 pontos)
  if (faturamentoEstimado >= 50000) {
    score += 5;
    motivos.push('Faturamento estimado alto (≥R$50k/mês)');
  } else if (faturamentoEstimado >= 20000) {
    score += 3;
    motivos.push('Faturamento estimado médio (≥R$20k/mês)');
  }

  return { score: Math.min(score, 100), motivos };
}
