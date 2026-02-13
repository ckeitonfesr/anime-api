const axiosPkg = require("axios");
const cheerioPkg = require("cheerio");

const axios = axiosPkg.default || axiosPkg;
const cheerioLoad = cheerioPkg.load || (cheerioPkg.default && cheerioPkg.default.load);

const SEARCH = "https://goyabu.io/wp-json/animeonline/search/";
const AJAX = "https://goyabu.io/wp-admin/admin-ajax.php";
const NONCE = "5ecb5079b5";

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj, null, 2));
}

async function fetchText(url, headers = {}) {
  const r = await fetch(url, { headers: { Accept: "*/*", ...headers } });
  const text = await r.text();
  return { status: r.status, contentType: r.headers.get("content-type") || "application/json", text };
}

async function fetchJson(url, headers = {}) {
  const r = await fetch(url, { headers: { Accept: "application/json", ...headers } });
  const data = await r.json();
  return { status: r.status, data };
}

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  }
  return "";
}

function normalizeAnime(it) {
  const id = String(pick(it, ["id", "post_id", "ID", "anime_id"]) || it.__anime_id || "");
  const title = pick(it, ["title", "name", "post_title", "anime_title", "titulo"]) || "Sem título";
  const link = pick(it, ["link", "url", "permalink", "href", "post_url", "guid"]) || "";
  const thumb = pick(it, ["image", "thumbnail", "thumb", "poster", "cover", "img", "banner"]) || "";
  const desc = pick(it, ["synopsis", "description", "resumo", "excerpt", "content", "summary"]) || "";
  const year = pick(it, ["year", "ano"]) || "";
  const rating = pick(it, ["rating", "nota", "score"]) || "";
  const pop = pick(it, ["pop", "views", "popularidade"]) || "";
  const status = pick(it, ["status", "situacao"]) || "";
  const genres = pick(it, ["genre", "generos", "genres"]) || "";
  return {
    id,
    title,
    link,
    thumb,
    desc,
    year,
    rating,
    pop,
    status,
    genres
  };
}

function toItems(data) {
  if (data && typeof data === "object" && data.error) return [];
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const entries = Object.entries(data);
    const numeric = entries.filter(([k]) => /^\d+$/.test(k));
    if (numeric.length > 0) return numeric.map(([k, v]) => ({ ...v, __anime_id: Number(k) }));
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
  }
  return [];
}

async function searchAnime(keyword) {
  const q = String(keyword || "").trim();
  if (!q) return [];
  const url = new URL(SEARCH);
  url.searchParams.set("keyword", q);
  url.searchParams.set("nonce", NONCE);

  const out = await fetchJson(url.toString(), { Accept: "application/json" });
  const items = toItems(out.data);
  return items.map(normalizeAnime).filter(x => x.id || x.link || x.title);
}

async function getEpisodes(animeId) {
  const id = String(animeId || "").trim();
  if (!id) return [];

  const url = new URL(AJAX);
  url.searchParams.set("action", "get_anime_episodes");
  url.searchParams.set("anime_id", id);

  const out = await fetchJson(url.toString(), {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest"
  });

  const arr = Array.isArray(out.data?.data) ? out.data.data : (Array.isArray(out.data) ? out.data : []);
  return arr.map(ep => ({
    id: String(ep.id),
    episodio: ep.episodio ?? "",
    episode_name: ep.episode_name ?? "",
    audio: ep.audio ?? "",
    update: ep.update ?? "",
    page_url: `https://goyabu.io/${encodeURIComponent(String(ep.id))}`
  }));
}

async function getEpisodeVideo(episodeId) {
  if (!cheerioLoad) return { ok: false, error: "Cheerio load() não disponível." };

  const pageUrl = `https://goyabu.io/${encodeURIComponent(String(episodeId))}`;
  const { data: html } = await axios.get(pageUrl, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html,*/*" }
  });

  const $ = cheerioLoad(html);

  const encrypted = $('.player-tab[data-player-type="iframe"]').attr("data-blogger-url-encrypted");
  if (encrypted) {
    const decoded = Buffer.from(encrypted, "base64").toString("utf8");
    const link = decoded.split("").reverse().join("");
    return { ok: true, video_url: link, source: "iframe_player", page_url: pageUrl };
  }

  const scriptText = $("script").text();
  const match = scriptText.match(/blogger_token":"([^"]+)"/);
  if (match) {
    const bloggerLink = `https://www.blogger.com/video.g?token=${match[1]}`;
    return { ok: true, video_url: bloggerLink, source: "blogger_token", page_url: pageUrl };
  }

  return { ok: false, error: "Não foi possível extrair o vídeo", page_url: pageUrl };
}

function intro(req) {
  const base = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}${req.url.split("?")[0]}`;
  return {
    success: true,
    name: "OverHub API (dvhackz)",
    how_to_use: [
      "1) Pesquise pelo nome: ?keyword=overlord",
      "2) Opcional: limitar resultados: &limit=5",
      "3) Opcional: incluir vídeos do EP 1: &include_video=1",
      "4) Se quiser só episódios: ?anime_id=ID",
      "5) Se quiser só vídeo: ?episode_id=ID"
    ],
    examples: {
      search_full: `${base}?keyword=overlord`,
      search_full_with_videos: `${base}?keyword=overlord&limit=3&include_video=1`,
      episodes_only: `${base}?anime_id=12345`,
      episode_video_only: `${base}?episode_id=69695`
    },
    notes: [
      "A busca usa o endpoint oficial do Goyabu (keyword + nonce). Se o nonce expirar, precisa atualizar.",
      "include_video=1 pode ficar mais lento porque tenta extrair o vídeo do primeiro episódio de cada anime."
    ]
  };
}

module.exports = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const animeId = String(req.query.anime_id || "").trim();
    const episodeId = String(req.query.episode_id || "").trim();

    if (!keyword && !animeId && !episodeId) {
      return json(res, 200, intro(req));
    }

    if (episodeId) {
      const out = await getEpisodeVideo(episodeId);
      if (!out.ok) return json(res, 200, { success: false, error: out.error, page_url: out.page_url, episode_id: episodeId });
      return json(res, 200, { success: true, episode_id: episodeId, page_url: out.page_url, video_url: out.video_url, source: out.source });
    }

    if (animeId && !keyword) {
      const eps = await getEpisodes(animeId);
      return json(res, 200, {
        success: true,
        anime_id: animeId,
        count: eps.length,
        data: eps
      });
    }

    if (keyword) {
      const limit = Math.max(1, Math.min(Number(req.query.limit || "8") || 8, 20));
      const includeVideo = String(req.query.include_video || "0") === "1";

      const results = await searchAnime(keyword);
      const sliced = results.slice(0, limit);

      const packed = [];
      for (const a of sliced) {
        const eps = a.id ? await getEpisodes(a.id) : [];
        let firstVideo = null;

        if (includeVideo && eps.length) {
          const out = await getEpisodeVideo(eps[0].id);
          if (out.ok) {
            firstVideo = { episode_id: eps[0].id, video_url: out.video_url, source: out.source, page_url: out.page_url };
          } else {
            firstVideo = { episode_id: eps[0].id, error: out.error, page_url: out.page_url };
          }
        }

        packed.push({
          anime: a,
          episodes: eps,
          first_video: firstVideo,
          endpoints: {
            episodes: `${req.url.split("?")[0]}?anime_id=${encodeURIComponent(a.id)}`,
            episode_video_example: eps.length ? `${req.url.split("?")[0]}?episode_id=${encodeURIComponent(eps[0].id)}` : null
          }
        });
      }

      return json(res, 200, {
        success: true,
        keyword,
        returned: packed.length,
        limit,
        include_video: includeVideo,
        data: packed
      });
    }

    return json(res, 400, { success: false, error: "Parâmetros inválidos. Use ?keyword=... ou ?anime_id=... ou ?episode_id=..." });
  } catch (err) {
    return json(res, 500, { success: false, error: err?.message || String(err) });
  }
};
