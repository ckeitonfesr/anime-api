const axios = require("axios");
const cheerio = require("cheerio");

function slugify(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

module.exports = async (req, res) => {
  try {
    const nome = String(req.query.nome || req.query.keyword || "").trim();

    if (!nome) {
      return res.status(400).json({
        success: false,
        error: "nome vazio"
      });
    }

    const slug = slugify(nome);
    const url = `https://goyabu.io/anime/${slug}`;

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html,*/*",
      },
      timeout: 20000,
    });

    const $ = cheerio.load(html);

    const full = $(".sinopse-full").text().trim();
    const short = $(".sinopse-short").text().trim();
    const sinopse = full || short || "Sinopse não encontrada";

    const title =
      $("h1").first().text().trim() ||
      $("meta[property='og:title']").attr("content") ||
      nome;

    return res.status(200).json({
      success: true,
      query: nome,
      slug,
      url,
      title,
      sinopse
    });

  } catch (err) {
    const msg = err?.response?.status
      ? `HTTP ${err.response.status}`
      : err?.message || String(err);

    return res.status(500).json({
      success: false,
      error: msg
    });
  }
};
