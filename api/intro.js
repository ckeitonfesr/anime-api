module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const base = "https://anime-api-kappa-one.vercel.app";

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Anime API</title>
  <style>
    :root{
      --bg:#070912;
      --text:#eaf1ff;
      --muted:rgba(234,241,255,.7);
      --line:rgba(255,255,255,.12);
      --panel:rgba(255,255,255,.06);
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family:var(--sans);
      background: linear-gradient(180deg, #050610, var(--bg));
      color:var(--text);
      padding:18px 14px 50px;
    }
    .wrap{max-width:820px;margin:0 auto}
    .top{
      border:1px solid var(--line);
      background:var(--panel);
      padding:14px 14px;
      border-radius:14px;
      margin-bottom:12px;
    }
    h1{margin:0;font-size:20px}
    .sub{margin:6px 0 0;color:var(--muted);font-size:13px;line-height:1.55}
    .item{
      border:1px solid var(--line);
      background:rgba(0,0,0,.18);
      padding:12px 12px;
      border-radius:14px;
      margin-top:10px;
    }
    .k{font-weight:800;font-size:13px;margin:0 0 6px}
    .d{margin:0;color:var(--muted);font-size:13px;line-height:1.55}
    pre{
      margin:10px 0 0;
      padding:10px 10px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(0,0,0,.35);
      overflow:auto;
      font-family:var(--mono);
      font-size:12.5px;
      color:rgba(234,241,255,.92);
    }
    a{color:inherit}
    .foot{
      margin-top:12px;
      color:rgba(234,255,255,.6);
      font-family:var(--mono);
      font-size:12px;
    }
  </style>
</head>
<body>
  <div class="wrap">

    <div class="top">
      <h1>Anime API</h1>
      <p class="sub">Docs simples. Credits: DVHACKZZ.</p>
    </div>

    <div class="item">
      <p class="k">Search</p>
      <p class="d">Busca por palavra.</p>
      <pre>${base}/api/search?keyword=overlord</pre>
    </div>

    <div class="item">
      <p class="k">Episodes</p>
      <p class="d">Lista episódios por anime_id.</p>
      <pre>${base}/api/episodes?anime_id=40927</pre>
    </div>

    <div class="item">
      <p class="k">Episode Video</p>
      <p class="d">Pega o link do vídeo por episode_id.</p>
      <pre>${base}/api/episode-video?episode_id=40930</pre>
    </div>

    <div class="item">
      <p class="k">Sinopse</p>
      <p class="d">Você pode passar o nome com espaços (na URL vira - ). A API troca por hífen (-) e monta a página.</p>
      <pre>${base}/api/sinopse?nome=Overlord-4-Dublado</pre>
      <pre>Ex: "Overlord 4 Dublado" -> ""Overlord-4-Dublado"</pre>
    </div>

    <div class="foot">Discord: dvhackzz</div>

  </div>
</body>
</html>`;

  return res.status(200).end(html);
};
