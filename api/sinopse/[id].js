const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = "https://goyabu.io/anime/";

module.exports = async (req, res) => {
  try {
    // Pega o ID diretamente da URL (ex: /api/sinopse/69698)
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID do anime não fornecido na URL"
      });
    }

    // Se for um ID numérico (como 69698), precisamos converter para o slug
    let slug = id;
    if (!isNaN(id)) {
      // Aqui você precisaria de uma lógica para converter ID numérico em slug
      // Por enquanto, vamos tentar usar o ID como slug mesmo
      console.log(`ID numérico detectado: ${id}, tentando como slug...`);
    }

    // Constrói a URL completa
    const url = BASE_URL + slug;
    
    console.log(`Buscando sinopse para: ${url}`);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const $ = cheerio.load(data);

    // Pegar sinopse
    let sinopse = $(".sinopse-full").text().trim() ||
                  $(".sinopse-short").text().trim() ||
                  $(".anime-sinopse").text().trim() ||
                  $("meta[name='description']").attr("content");

    sinopse = sinopse.replace(/\s+/g, ' ').trim();

    return res.status(200).json({
      success: true,
      data: {
        id: id,
        url: url,
        sinopse: sinopse || "Sinopse não encontrada"
      }
    });

  } catch (error) {
    console.error("Erro:", error);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Anime não encontrado. Verifique o ID."
      });
    }

    return res.status(500).json({
      success: false,
      error: error?.message || "Erro interno"
    });
  }
};
