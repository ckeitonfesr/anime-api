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
    const raw = Array.isArray(req.query.nome)
      ? req.query.nome[0]
      : req.query.nome;

    const nome = decodeURIComponent(String(raw || "")).trim();

    if (!nome) {
      return res.status(400).json({ error: "nome vazio" });
    }

    const slug = slugify(nome);
    const url = `https://goyabu.io/anime/${slug}`;

    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 20000,
    });

    const $ = cheerio.load(html);

    const title =
      $("h1").first().text().trim() ||
      $("meta[property='og:title']").attr("content") ||
      nome;

    const full = $(".sinopse-full").text().trim();
    const short = $(".sinopse-short").text().trim();
    const sinopse = full || short || "Sinopse não encontrada";

    return res.status(200).json({
      title,
      sinopse
    });

  } catch (err) {
    const status = err?.response?.status;
    return res.status(status === 404 ? 404 : 500).json({
      error: status ? "Anime não encontrado" : err.message
    });
  }
};
