const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  try {
    const id = String(req.query.id || "").trim();

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Passe o ID. Ex: /api/sinopse?id=69698"
      });
    }

    const pageUrl = `https://goyabu.io/${id}`;

    const { data } = await axios.get(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html,*/*"
      }
    });

    const $ = cheerio.load(data);

    // 🔥 SINOPSE
    const full = $(".sinopse-full").text().trim();
    const short = $(".sinopse-short").text().trim();
    const sinopse = full || short || "Sinopse não encontrada";

    // 🔥 TITULO
    const title =
      $("h1").first().text().trim() ||
      $("meta[property='og:title']").attr("content") ||
      "";

    // 🔥 IMAGEM
    const image =
      $(".anime-thumb img").attr("src") ||
      $("meta[property='og:image']").attr("content") ||
      "";

    return res.status(200).json({
      success: true,
      id,
      page_url: pageUrl,
      title,
      image,
      sinopse
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || String(err)
    });
  }
};
