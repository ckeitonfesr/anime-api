const AJAX = "https://goyabu.io/wp-admin/admin-ajax.php";
const BASE = "https://goyabu.io";
const TIMEOUT_MS = 12000;

module.exports = async (req, res) => {
  try {
    const animeId = String(req.query.anime_id || "").trim();
    if (!animeId || !/^\d+$/.test(animeId)) {
      return res.status(400).json({ error: "anime_id inválido" });
    }

    const url = `${AJAX}?action=get_anime_episodes&anime_id=${encodeURIComponent(animeId)}`;

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      signal: ac.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://goyabu.io/",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
      redirect: "follow",
    }).finally(() => clearTimeout(t));

    if (!response.ok) {
      return res.status(502).json({ error: `upstream status ${response.status}` });
    }

    const ct = response.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const preview = (await response.text()).slice(0, 200);
      return res.status(502).json({ error: "upstream não retornou JSON", preview });
    }

    const data = await response.json();

    if (data?.success && Array.isArray(data.data)) {
      const out = new Array(data.data.length);
      for (let i = 0; i < data.data.length; i++) {
        const ep = data.data[i] || {};
        out[i] = {
          id: ep.id,
          episodio: ep.episodio,
          link: ep.link ? (ep.link.startsWith("http") ? ep.link : BASE + ep.link) : "",
          type: ep.type,
          episode_name: ep.episode_name,
          audio: ep.audio,
          imagem: ep.imagem ? (ep.imagem.startsWith("http") ? ep.imagem : BASE + ep.imagem) : "",
          update: ep.update,
          status: ep.status,
        };
      }
      data.data = out;
    }

    return res.status(200).json(data);
  } catch (err) {
    const isTimeout = String(err?.name || "").includes("AbortError");
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout ? "timeout no upstream" : String(err?.message || err),
    });
  }
};
