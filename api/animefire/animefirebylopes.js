import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://animefire.io";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

// ==================== LANÇAMENTOS ====================
async function getLancamentos() {
  const { data } = await axios.get(BASE_URL, {
    headers: HEADERS,
  });

  const $ = cheerio.load(data);
  const results = [];

  $(".owl-carousel-home .divArticleLancamentos").each(
    (_, el) => {
      const card = $(el);
      const link = card.find("a").first();
      const href = link.attr("href");

      if (!href) return;

      const titulo =
        card.find(".animeTitle").text().trim() ||
        card.attr("title") ||
        "N/A";

      const imgSrc =
        card.find("img").attr("src") ||
        card.find("img").attr("data-src") ||
        "";

      const imagem = imgSrc.startsWith("http")
        ? imgSrc
        : `${BASE_URL}${imgSrc}`;

      const score =
        card.find(".horaUltimosEps").text().trim() ||
        "N/A";

      const match = href.match(
        /\/animes\/(.+?)(-todos-os-episodios)?$/
      );

      if (!match) return;

      results.push({
        titulo,
        animeId: match[1],
        url: `${BASE_URL}${href}`,
        imagem,
        score,
        tipo: "lancamento",
      });
    }
  );

  return results;
}

// ==================== DESTAQUES ====================
async function getDestaques() {
  const { data } = await axios.get(BASE_URL, {
    headers: HEADERS,
  });

  const $ = cheerio.load(data);
  const results = [];

  $(".owl-carousel-semana .divArticleLancamentos").each(
    (_, el) => {
      const card = $(el);
      const link = card.find("a").first();
      const href = link.attr("href");

      if (!href) return;

      const titulo =
        card.find(".animeTitle").text().trim() ||
        card.attr("title") ||
        "N/A";

      const posicao =
        card.find(".numbTopTen").text().trim() ||
        "N/A";

      const match = href.match(
        /\/animes\/(.+?)(-todos-os-episodios)?$/
      );

      if (!match) return;

      results.push({
        posicao,
        titulo,
        animeId: match[1],
        url: `${BASE_URL}${href}`,
        tipo: "destaque",
      });
    }
  );

  return results;
}

// ==================== EPISÓDIOS ====================
async function getEpisodios(page = 1) {
  const url =
    page === 1
      ? BASE_URL
      : `${BASE_URL}/home/${page}`;

  const { data } = await axios.get(url, {
    headers: HEADERS,
  });

  const $ = cheerio.load(data);
  const episodios = [];

  $(".divCardUltimosEpsHome").each((_, el) => {
    const card = $(el);
    const link = card.find("a").first();
    const href = link.attr("href");

    if (!href) return;

    const titulo =
      card.find(".animeTitle").text().trim() ||
      card.attr("title") ||
      "N/A";

    const numEp =
      card.find(".numEp").text().trim() ||
      "N/A";

    const match = href.match(
      /\/animes\/(.+?)\/(\d+)$/
    );

    if (!match) return;

    episodios.push({
      titulo,
      animeId: match[1],
      episodio: match[2] || numEp,
      url: `${BASE_URL}${href}`,
      tipo: "episodio",
    });
  });

  return {
    currentPage: page,
    total: episodios.length,
    episodios,
  };
}

// ==================== TODAS AS PÁGINAS ====================
async function getAll(maxPages = 5) {
  let all = [];

  for (let i = 1; i <= maxPages; i++) {
    const data = await getEpisodios(i);
    all = [...all, ...data.episodios];
  }

  return {
    total: all.length,
    episodios: all,
  };
}

// ==================== HANDLER ====================
export default async function handler(req, res) {
  const { type, page, maxPages } = req.query;

  if (!type) {
    return res.status(400).json({
      status: false,
      message:
        "Use ?type=lancamentos|destaques|episodios|all",
    });
  }

  try {
    if (type === "lancamentos") {
      const data = await getLancamentos();
      return res.status(200).json({
        status: true,
        type,
        total: data.length,
        data,
      });
    }

    if (type === "destaques") {
      const data = await getDestaques();
      return res.status(200).json({
        status: true,
        type,
        total: data.length,
        data,
      });
    }

    if (type === "episodios") {
      const data = await getEpisodios(
        parseInt(page) || 1
      );
      return res.status(200).json({
        status: true,
        type,
        ...data,
      });
    }

    if (type === "all") {
      const data = await getAll(
        parseInt(maxPages) || 5
      );
      return res.status(200).json({
        status: true,
        type,
        ...data,
      });
    }

    return res.status(400).json({
      status: false,
      message: "Tipo inválido",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Erro interno",
      error: err.message,
    });
  }
}
