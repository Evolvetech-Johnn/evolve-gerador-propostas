/**
 * googlePlaces.service.js
 * Busca estabelecimentos via Google Places API (Text Search + Details).
 * Só é usado quando GOOGLE_PLACES_API_KEY estiver definida no .env.
 */
import axios from 'axios';

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';

/**
 * Busca estabelecimentos pelo nicho+cidade+estado.
 * @param {object} params
 * @param {string} params.nicho
 * @param {string} params.cidade
 * @param {string} params.estado
 * @param {string} params.apiKey
 * @returns {Promise<Array>} Array de leads normalizados
 */
export async function buscarEstabelecimentos({ nicho, cidade, estado, apiKey }) {
  const query = `${nicho} em ${cidade} ${estado}`;

  const { data } = await axios.get(`${PLACES_BASE}/textsearch/json`, {
    params: {
      query,
      language: 'pt-BR',
      region: 'br',
      key: apiKey,
    },
    timeout: 15000,
  });

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places error: ${data.status} — ${data.error_message || ''}`);
  }

  const results = data.results || [];

  // Busca detalhes adicionais (telefone, website) para cada resultado
  const detalhados = await Promise.allSettled(
    results.slice(0, 20).map((place) => buscarDetalhes(place.place_id, apiKey))
  );

  return results.slice(0, 20).map((place, i) => {
    const detalhes = detalhados[i].status === 'fulfilled' ? detalhados[i].value : {};
    return {
      placeId: place.place_id,
      nome: place.name,
      endereco: place.formatted_address,
      telefone: detalhes.formatted_phone_number || null,
      website: detalhes.website || null,
      rating: place.rating || null,
      userRatingsTotal: place.user_ratings_total || 0,
      tipos: place.types || [],
      lat: place.geometry?.location?.lat,
      lon: place.geometry?.location?.lng,
      fonte: 'google_places',
    };
  });
}

/**
 * Busca detalhes de um lugar (telefone + website) via Place Details.
 * @param {string} placeId
 * @param {string} apiKey
 */
async function buscarDetalhes(placeId, apiKey) {
  const { data } = await axios.get(`${PLACES_BASE}/details/json`, {
    params: {
      place_id: placeId,
      fields: 'formatted_phone_number,website',
      language: 'pt-BR',
      key: apiKey,
    },
    timeout: 10000,
  });
  return data.result || {};
}
