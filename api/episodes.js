const AJAX = "https://goyabu.io/wp-admin/admin-ajax.php";

module.exports = async (req, res) => {
  try {
    const animeId = String(req.query.anime_id || "").trim();
    if (!animeId) {
      res.status(400).json({ error: "anime_id vazio" });
      return;
    }

    const url = new URL(AJAX);
    url.searchParams.set("action", "get_anime_episodes");
    url.searchParams.set("anime_id", animeId);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    const text = await response.text();

    res.statusCode = response.status;
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );
    res.end(text);

  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
};
