/**
 * nominatim.service.js
 * Busca estabelecimentos via Nominatim (OpenStreetMap) — gratuito, sem API key.
 * Rate limit obrigatório: 1 req/s conforme política de uso da API.
 * User-Agent identificado conforme exigência do Nominatim.
 */
import axios from 'axios';
import pLimit from 'p-limit';

const USER_AGENT = 'EvolveGeradorPropostas/1.0 (evolvetechsolutionsldn@gmail.com)';
const BASE_URL = 'https://nominatim.openstreetmap.org';

// 1 requisição simultânea por vez (rate limit do Nominatim)
const limiter = pLimit(1);

/** Pausa mínima de 1100ms entre chamadas para respeitar o rate limit */
function delay(ms = 1100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Geocoda uma cidade+estado para obter coordenadas.
 * @param {string} cidade
 * @param {string} estado - sigla UF (ex: "SP")
 * @returns {Promise<{ lat: number, lon: number } | null>}
 */
async function geocodarCidade(cidade, estado) {
  return limiter(async () => {
    await delay();
    try {
      const { data } = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: `${cidade}, ${estado}, Brasil`,
          format: 'json',
          limit: 1,
        },
        headers: { 'User-Agent': USER_AGENT },
        timeout: 10000,
      });
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch {
      return null;
    }
  });
}

/**
 * Busca estabelecimentos por nicho num raio ao redor das coordenadas.
 * @param {object} params
 * @param {string} params.nicho
 * @param {string} params.cidade
 * @param {string} params.estado
 * @returns {Promise<Array>} Array de leads normalizados
 */
export async function buscarEstabelecimentos({ nicho, cidade, estado }) {
  const coords = await geocodarCidade(cidade, estado);
  if (!coords) return [];

  return limiter(async () => {
    await delay();
    try {
      // Busca via Overpass API (OSM) — mais rica que o Nominatim para POIs
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["name"~"${nicho}",i](around:10000,${coords.lat},${coords.lon});
          way["name"~"${nicho}",i](around:10000,${coords.lat},${coords.lon});
        );
        out body;
      `;

      const { data } = await axios.post(
        'https://overpass-api.de/api/interpreter',
        overpassQuery,
        {
          headers: {
            'Content-Type': 'text/plain',
            'User-Agent': USER_AGENT,
          },
          timeout: 30000,
        }
      );

      const elementos = data?.elements || [];

      // Normaliza para o mesmo schema do Google Places
      return elementos.slice(0, 20).map((el) => ({
        placeId: `osm_${el.type}_${el.id}`,
        nome: el.tags?.name || 'Sem nome',
        endereco: [
          el.tags?.['addr:street'],
          el.tags?.['addr:housenumber'],
          el.tags?.['addr:city'] || cidade,
          el.tags?.['addr:state'] || estado,
        ]
          .filter(Boolean)
          .join(', '),
        telefone: el.tags?.phone || el.tags?.['contact:phone'] || null,
        website: el.tags?.website || el.tags?.['contact:website'] || null,
        rating: null,
        userRatingsTotal: 0,
        tipos: Object.keys(el.tags || {})
          .filter((k) => k === 'amenity' || k === 'shop' || k === 'tourism')
          .map((k) => el.tags[k]),
        lat: el.lat || (el.center?.lat ?? coords.lat),
        lon: el.lon || (el.center?.lon ?? coords.lon),
        fonte: 'nominatim',
      }));
    } catch {
      return [];
    }
  });
}
