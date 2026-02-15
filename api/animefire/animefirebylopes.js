import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://animefire.io";

// Headers simulando navegador
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Referer": BASE_URL
};

// Função principal
async function getUltimosEpisodios(page = 1) {
  try {
    const url = page === 1 ? BASE_URL : `${BASE_URL}/home/${page}`;
    
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const episodios = [];

    $(".divCardUltimosEpsHome").each((i, el) => {
      const card = $(el);
      const link = card.find("a").first();
      const href = link.attr("href");

      if (!href) return;

      // Título
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

      // Extrair ID do anime e número do episódio
      const match = href.match(/\/animes\/(.+?)\/(\d+)$/);
      if (!match) return;

      episodios.push({
        id: i + 1,
        titulo: titulo,
        animeId: match[1],
        episodio: match[2] || numEp,
        url: href.startsWith("http") ? href : `${BASE_URL}${href}`,
        imagem: imgSrc
      });
    });

    // Verificar próxima página
    const nextPageLink = $('.pagination .page-item:last-child a[href*="home"]').attr('href');
    const hasNextPage = nextPageLink ? true : false;

    return {
      success: true,
      page: page,
      total: episodios.length,
      episodios: episodios,
      nextPage: hasNextPage ? page + 1 : null
    };

  } catch (error) {
    console.error("Erro:", error.message);
    return {
      success: false,
      page: page,
      error: error.message,
      episodios: []
    };
  }
}

// Handler da Vercel
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: "Método não permitido. Use GET." 
    });
  }

  // Pegar página da query
  const { page } = req.query;
  const pageNum = parseInt(page) || 1;

  if (pageNum < 1) {
    return res.status(400).json({ 
      success: false, 
      error: "Página inválida. Use página >= 1." 
    });
  }

  try {
    const data = await getUltimosEpisodios(pageNum);
    
    if (data.success) {
      return res.status(200).json(data);
    } else {
      return res.status(500).json(data);
    }
    
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
