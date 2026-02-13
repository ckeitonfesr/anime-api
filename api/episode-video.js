module.exports = async (req, res) => {
  try {
    const episodeId = String(req.query.episode_id || "").trim();
    if (!episodeId) {
      res.status(400).json({ success: false, error: "episode_id vazio" });
      return;
    }

    const pageUrl = `https://goyabu.io/${encodeURIComponent(episodeId)}`;

    res.json({
      success: true,
      page_url: pageUrl
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: String(err?.message || err)
    });
  }
};
