const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE = "https://goyabu.io";

function genreUrl(genero) {
  return `${BASE}/generos/${genero}`;
}

async function fetchHtml(url) {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  return data;
}

async function getAnimesDoGenero(genero) {
  const html = await fetchHtml(genreUrl(genero));
  const $ = cheerio.load(html);
  const animes = [];

  $(".boxAN").each((_, el) => {
    const a = $(el).find("a").first();
    const titulo = $(el).find(".title").text().trim();
    const url = a.attr("href");

    if (titulo && url) {
      animes.push({
        titulo,
        url
      });
    }
  });

  return animes;
}

// 👉 AQUI é o endpoint que você quer
app.get("/api/generos", async (req, res) => {
  try {
    const genero = (req.query.genero || "").toLowerCase();

    if (!genero) {
      return res.status(400).json({ error: "Passe o genero: ?genero=acao" });
    }

    const data = await getAnimesDoGenero(genero);
    res.json({ genero, total: data.length, data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log("Rodando na porta", PORT));
