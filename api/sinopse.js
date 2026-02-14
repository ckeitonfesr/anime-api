const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const url = String(req.query.url || "").trim();

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL vazia"
      });
    }

    // Verificar se é uma URL válida do goyabu
    if (!url.includes('goyabu.io')) {
      return res.status(400).json({
        success: false,
        error: "URL inválida - use apenas URLs do goyabu.io"
      });
    }

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);

    // Pegar sinopse
    const full = $(".sinopse-full").text().trim();
    const short = $(".sinopse-short").text().trim();
    const sinopse = full || short;

    // Pegar título
    const titulo = $(".entry-title").text().trim();

    // Pegar link do player
    let playerLink = $("#player iframe").attr("src");
    
    // Se não encontrar com #player, tenta outros seletores comuns
    if (!playerLink) {
      playerLink = $("iframe[src*='goyabu']").attr("src") || 
                   $(".video-embed iframe").attr("src") ||
                   $(".player iframe").attr("src");
    }

    // Limpar o link do player se necessário
    if (playerLink && playerLink.startsWith('//')) {
      playerLink = 'https:' + playerLink;
    }

    // Retornar os dados
    return res.status(200).json({
      success: true,
      data: {
        titulo: titulo,
        sinopse: sinopse,
        player_link: playerLink || null,
        url_original: url
      }
    });

  } catch (error) {
    console.error("Erro detalhado:", error);
    
    return res.status(500).json({
      success: false,
      error: error?.message || "Erro interno do servidor"
    });
  }
};
