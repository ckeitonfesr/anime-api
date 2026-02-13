const axiosPkg = require("axios");
const cheerioPkg = require("cheerio");

const axios = axiosPkg.default || axiosPkg;
const load = cheerioPkg.load || (cheerioPkg.default && cheerioPkg.default.load);

module.exports = async (req, res) => {
  try {
    const episodeId = String(req.query.episode_id || "").trim();
    if (!episodeId) return res.status(400).json({ success: false, error: "episode_id vazio" });

    if (!load) {
      return res.status(500).json({
        success: false,
        error: "Cheerio load() não disponível (import/require quebrado)."
      });
    }

    const pageUrl = `https://goyabu.io/${encodeURIComponent(episodeId)}`;

    const { data } = await axios.get(pageUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = load(data);

    const encrypted = $('.player-tab[data-player-type="iframe"]').attr("data-blogger-url-encrypted");
    if (encrypted) {
      const decoded = Buffer.from(encrypted, "base64").toString("utf8");
      const link = decoded.split("").reverse().join("");

      return res.json({ success: true, video_url: link, source: "iframe_player" });
    }

    const scriptText = $("script").text();
    const match = scriptText.match(/blogger_token":"([^"]+)"/);
    if (match) {
      const bloggerLink = `https://www.blogger.com/video.g?token=${match[1]}`;
      return res.json({ success: true, video_url: bloggerLink, source: "blogger_token" });
    }

    return res.json({ success: false, error: "Não foi possível extrair o vídeo" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
};
