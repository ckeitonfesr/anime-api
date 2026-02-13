const SEARCH = "https://goyabu.io/wp-json/animeonline/search/";
const NONCE = "5ecb5079b5";

module.exports = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    if (!keyword) {
      res.status(400).json({ error: "keyword vazio" });
      return;
    }

    const url = new URL(SEARCH);
    url.searchParams.set("keyword", keyword);
    url.searchParams.set("nonce", NONCE);

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" }
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
