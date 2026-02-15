const axios = require("axios");
const cheerio = require("cheerio");

const SEARCH = "https://goyabu.io/wp-json/animeonline/search/";
const NONCE = "5ecb5079b5";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function normUrl(u) {
  if (!u) return null;
  if (u.startsWith("http")) return u;
  return "https://goyabu.io" + (u.startsWith("/") ? u : "/" + u);
}

function slugFromUrl(u) {
  try {
    const p = new URL(u).pathname.split("/").filter(Boolean);
    return p[p.length - 1] || null;
  } catch {
    const p = String(u || "").split("/").filter(Boolean);
    return p[p.length - 1] || null;
  }
}

function scoreTitle(title, q) {
  const t = String(title || "").toLowerCase();
  const k = String(q || "").toLowerCase();
  if (!t || !k) return 0;
  if (t === k) return 100;
  if (t.includes(k)) return 80;
  const w = k.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const token of w) if (t.includes(token)) s += 10;
  return s;
}

async function getGenerosFromAnimeUrl(animeUrl) {
  try {
    const { data } = await axios.get(animeUrl, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      timeout: 3500
    });

    const $ = cheerio.load(data);
    const generos = [];

    $('.filter-btn[href*="generos"], a[href*="/generos/"]').each((_, el) => {
      const g = $(el).text().trim();
      if (g && !generos.includes(g)) generos.push(g);
    });

    return generos;
  } catch {
    return [];
  }
}

module.exports = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const comGeneros = String(req.query.generos || req.query.com_generos || "1") === "1";

    if (!keyword) {
      return res.status(400).json({ success: false, error: "keyword vazio" });
    }

    const url = new URL(SEARCH);
    url.searchParams.set("keyword", keyword);
    url.searchParams.set("nonce", NONCE);

    const r = await axios.get(url.toString(), {
      headers: { "User-Agent": UA, Accept: "application/json" },
      timeout: 6000
    });

    const obj = typeof r.data === "string" ? JSON.parse(r.data) : r.data;
    const list = Object.entries(obj || {}).map(([id, v]) => ({
      id: String(id),
      titulo: v?.title || "",
      url: normUrl(v?.url),
      thumb: normUrl(v?.img),
      audio: v?.audio ?? null,
      year: v?.year ?? null
    })).filter(x => x.url && x.titulo);

    if (!list.length) return res.status(200).json([]);

    list.sort((a, b) => scoreTitle(b.titulo, keyword) - scoreTitle(a.titulo, keyword));
    const best = list[0];

    const slug = slugFromUrl(best.url);
    let generos = [];

    if (comGeneros) {
      generos = await getGenerosFromAnimeUrl(best.url);
    }

    return res.status(200).json([{
      id: best.id || null,
      slug,
      titulo: best.titulo,
      thumb: best.thumb || null,
      url: best.url,
      generos: generos.length ? generos : ["Não informado"]
    }]);

  } catch (err) {
    return res.status(500).json({ success: false, error: String(err?.message || err) });
  }
};
