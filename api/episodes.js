const AJAX = "https://goyabu.io/wp-admin/admin-ajax.php";
const BASE = "https://goyabu.io";

module.exports = async (req, res) => {
  try {
    const animeId = String(req.query.anime_id || "").trim();

    if (!animeId || !/^\d+$/.test(animeId)) {
      return res.status(400).json({ error: "anime_id inválido" });
    }

    const url = new URL(AJAX);
    url.searchParams.set("action", "get_anime_episodes");
    url.searchParams.set("anime_id", animeId);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        Referer: "https://goyabu.io/"
      }
    });

    const data = await response.json();

    if (data?.success && Array.isArray(data.data)) {
      data.data = data.data.map(ep => {
        return {
          id: ep.id,
          episodio: ep.episodio,
          link: BASE + ep.link,
          type: ep.type,
          episode_name: ep.episode_name,
          audio: ep.audio,
          imagem: ep.imagem ? BASE + ep.imagem : "",
          update: ep.update,
          status: ep.status
        };
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: String(err?.message || err)
    });
  }
};
