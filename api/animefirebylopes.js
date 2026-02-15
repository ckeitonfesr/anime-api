import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://animefire.io";

// Lista de User-Agents para rotacionar
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
];

// Headers base
const getHeaders = (userIp = null, attempt = 0) => ({
  "User-Agent": USER_AGENTS[attempt % USER_AGENTS.length],
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": BASE_URL,
  "Origin": BASE_URL,
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Cache-Control": "max-age=0",
  ...(userIp && {
    "X-Forwarded-For": userIp,
    "X-Real-IP": userIp,
    "CF-Connecting-IP": userIp
  })
});

// ==================== ÚLTIMOS EPISÓDIOS ====================
async function getUltimosEpisodios(page = 1, userIp = null) {
  const url = page === 1 ? BASE_URL : `${BASE_URL}/home/${page}`;
  
  // Tentar com até 3 User-Agents diferentes
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`📡 Tentativa ${attempt + 1} - Página ${page}`);
      
      const response = await axios.get(url, {
        headers: getHeaders(userIp, attempt),
        timeout: 15000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);
      const episodios = [];

      $(".divCardUltimosEpsHome").each((i, el) => {
        const link = $(el).find("a").first();
        const href = link.attr("href");
        if (!href) return;

        // Título
        let titulo = $(el).find(".animeTitle").text().trim();
        if (!titulo) {
          titulo = $(el).attr("title") || "N/A";
          titulo = titulo.replace(/\s*-\s*Episódio\s+\d+$/, "");
        }

        // Imagem
        const img = $(el).find("img");
        let imgSrc = img.attr("src") || img.attr("data-src") || "";
        if (imgSrc && !imgSrc.startsWith("http")) {
          imgSrc = `${BASE_URL}${imgSrc}`;
        }

        // Extrair ID e número do episódio
        const match = href.match(/\/animes\/(.+?)\/(\d+)$/);
        if (!match) return;

        episodios.push({
          id: i + 1,
          titulo: titulo,
          animeId: match[1],
          episodio: match[2],
          url: href.startsWith("http") ? href : `${BASE_URL}${href}`,
          imagem: imgSrc,
          data: $(el).find(".ep-dateModified").text().trim() || "N/A"
        });
      });

      // Verificar próxima página
      const nextPageLink = $('.pagination .page-item:last-child a[href*="home"]').attr('href');
      
      return {
        success: true,
        page: page,
        total: episodios.length,
        hasNextPage: !!nextPageLink,
        nextPage: nextPageLink ? page + 1 : null,
        episodios: episodios
      };

    } catch (error) {
      console.log(`⚠️ Tentativa ${attempt + 1} falhou:`, error.message);
      
      if (attempt === 2) {
        throw new Error(`Falha após 3 tentativas: ${error.message}`);
      }
      
      // Aguarda 2 segundos antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// ==================== BUSCAR ANIME ====================
async function searchAnime(query, userIp = null) {
  try {
    const url = `${BASE_URL}/pesquisar/${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: getHeaders(userIp),
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const resultados = [];

    $('.col-6.col-sm-4.col-md-3.col-lg-2.mb-1.minWDanime').each((i, el) => {
      const link = $(el).find('a').first();
      const href = link.attr('href');
      
      const match = href?.match(/\/animes\/(.+?)(-todos-os-episodios)?$/);
      if (!match) return;

      resultados.push({
        id: i + 1,
        titulo: $(el).find('.animeTitle').text().trim() || $(el).attr('title') || "N/A",
        animeId: match[1].replace('-todos-os-episodios', ''),
        score: $(el).find('.horaUltimosEps').text().trim() || "N/A",
        imagem: $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || ""
      });
    });

    return {
      success: true,
      query: query,
      total: resultados.length,
      resultados: resultados
    };

  } catch (error) {
    throw error;
  }
}

// ==================== HANDLER PRINCIPAL ====================
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pegar IP do usuário
  const userIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                 req.headers['x-real-ip'] || 
                 req.socket.remoteAddress;

  const { method, page, query } = req.query;

  try {
    let result;

    switch(method) {
      case 'search':
        if (!query) throw new Error("Query é obrigatória para busca");
        result = await searchAnime(query, userIp);
        break;

      case 'ultimos':
      default:
        const pageNum = parseInt(page) || 1;
        result = await getUltimosEpisodios(pageNum, userIp);
        break;
    }

    return res.status(200).json({
      ...result,
      userIp: userIp,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Erro:", error.message);
    
    const statusCode = error.message.includes('403') ? 403 : 500;
    
    return res.status(statusCode).json({
      success: false,
      error: error.message,
      userIp: userIp,
      method: method || 'ultimos',
      timestamp: new Date().toISOString()
    });
  }
}
