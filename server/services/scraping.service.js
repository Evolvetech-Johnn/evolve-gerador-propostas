/**
 * scraping.service.js
 * Extrai links de redes sociais do site de um estabelecimento via Cheerio.
 * Responsabilidade única: HTTP fetch + parse HTML. Sem lógica de negócio.
 */
import axios from 'axios';
import * as cheerio from 'cheerio';

const TIMEOUT_MS = 8000;

/**
 * Dado um site, tenta encontrar links para redes sociais.
 * @param {string|undefined} siteUrl
 * @returns {Promise<{ instagram?: string, facebook?: string, linkedin?: string, youtube?: string, tiktok?: string }>}
 */
export async function scraparRedesSociais(siteUrl) {
  if (!siteUrl) return {};

  try {
    const url = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
    const { data: html } = await axios.get(url, {
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'EvolveGeradorPropostas/1.0 (gerador de propostas comerciais)',
        Accept: 'text/html',
      },
      maxRedirects: 3,
    });

    const $ = cheerio.load(html);
    const redes = {};

    $('a[href]').each((_i, el) => {
      const href = $(el).attr('href') || '';
      if (!redes.instagram && href.includes('instagram.com')) redes.instagram = href;
      if (!redes.facebook && href.includes('facebook.com')) redes.facebook = href;
      if (!redes.linkedin && href.includes('linkedin.com')) redes.linkedin = href;
      if (!redes.youtube && href.includes('youtube.com')) redes.youtube = href;
      if (!redes.tiktok && href.includes('tiktok.com')) redes.tiktok = href;
    });

    return redes;
  } catch {
    // Site inacessível, timeout, etc. — retorna vazio sem estourar
    return {};
  }
}
