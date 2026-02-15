const AJAX = "https://goyabu.io/wp-admin/admin-ajax.php";
const BASE = "https://goyabu.io";

function absUrl(u) {
  if (!u) return "";
  u = String(u).trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return BASE + u;
  return BASE + "/" + u;
}

module.exports = async (req, res) => {
  try {
    const animeId = String(req.query.anime_id || "").trim();

    if (!animeId || !/^\d+$/.test(animeId)) {
      res.status(400).json({ success: false, error: "anime_id inválido" });
      return;
    }

    const url = new URL(AJAX);
    url.searchParams.set("action", "get_anime_episodes");
    url.searchParams.set("anime_id", animeId);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        Referer: BASE + "/"
      }
    });

    const data = await response.json();

    if (data?.success && Array.isArray(data.data)) {
      data.data = data.data.map((ep) => ({
        id: ep?.id ?? null,
        episodio: String(ep?.episodio ?? ""),
        link: absUrl(ep?.link),
        type: String(ep?.type ?? ""),
        episode_name: String(ep?.episode_name ?? ""),
        audio: String(ep?.audio ?? ""),
        imagem: absUrl(ep?.imagem),
        update: String(ep?.update ?? ""),
        status: String(ep?.status ?? "")
      }));
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: String(err?.message || err) });
  }
};
