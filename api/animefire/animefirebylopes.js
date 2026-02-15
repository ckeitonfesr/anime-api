import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://animefire.io";

// Headers completos simulando navegador real
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
  "Sec-Fetch-User": "?1",
  "Cache-Control": "max-age=0"
};

// ==================== FUNÇÃO COM RETRY ====================
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: HEADERS,
        timeout: 15000,
        maxRedirects: 5
      });
      return response;
    } catch (error) {
      console.log(`⚠️ Tentativa ${i + 1} falhou: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos entre tentativas
    }
  }
}

// ==================== FUNÇÃO PRINCIPAL ====================
async function getUltimosEpisodios(page = 1) {
  try {
    const url = page === 1 ? BASE_URL : `${BASE_URL}/home/${page}`;
    console.log(`📡 Buscando: ${url}`);

    const response = await fetchWithRetry(url);
    const $ = cheerio.load(response.data);
    const episodios = [];

    $(".divCardUltimosEpsHome").each((i, el) => {
      const card = $(el);
      const link = card.find("a").first();
      const href = link.attr("href");

      if (!href) return;

      // Título do anime
      let titulo = card.find(".animeTitle").text().trim();
      if (!titulo) {
        titulo = card.attr("title") || "N/A";
        titulo = titulo.replace(/\s*-\s*Episódio\s+\d+$/, "");
      }

      // Número do episódio
      const numEp = card.find(".numEp").text().trim() || "N/A";

      // Imagem
      const img = card.find("img");
      let imgSrc = img.attr("src") || img.attr("data-src") || "";
      if (imgSrc && !imgSrc.startsWith("http")) {
        imgSrc = `${BASE_URL}${imgSrc}`;
      }

      // Extrair animeId e número do episódio da URL
      const match = href.match(/\/animes\/(.+?)\/(\d+)$/);
      if (!match) return;

      // Data de modificação
      const dataMod = card.find(".ep-dateModified").text().trim() || "N/A";

      episodios.push({
        id: i + 1,
        titulo: titulo,
        animeId: match[1],
        episodio: match[2] || numEp,
        url: href.startsWith("http") ? href : `${BASE_URL}${href}`,
        imagem: imgSrc,
        data: dataMod
      });
    });

    // Verificar próxima página
    const nextPageLink = $('.pagination .page-item:last-child a[href*="home"]').attr('href');
    const hasNextPage = nextPageLink ? true : false;

    return {
      status: true,
      currentPage: page,
      total: episodios.length,
      episodios: episodios,
      hasNextPage: hasNextPage,
      nextPage: hasNextPage ? page + 1 : null
    };

  } catch (error) {
    console.error('❌ Erro:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });

    throw error;
  }
}

// ==================== HANDLER DA API ====================
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      status: false,
      message: 'Método não permitido. Use GET.'
    });
  }

  const { page } = req.query;
  const pageNum = parseInt(page) || 1;

  if (pageNum < 1) {
    return res.status(400).json({
      status: false,
      message: 'Página inválida. Use página >= 1.'
    });
  }

  try {
    const data = await getUltimosEpisodios(pageNum);
    return res.status(200).json(data);

  } catch (error) {
    const statusCode = error.response?.status === 403 ? 403 : 500;
    
    return res.status(statusCode).json({
      status: false,
      message: 'Erro ao buscar episódios',
      error: error.message,
      page: pageNum
    });
  }
}

// ==================== TESTE LOCAL ====================
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const testPage = process.argv[2] || 1;
  
  getUltimosEpisodios(parseInt(testPage))
    .then(data => {
      console.log('\n✅ SUCESSO!\n');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
      console.log('\n❌ ERRO!\n');
      console.log(error.message);
    });
}
