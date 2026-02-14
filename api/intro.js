module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const base = "https://anime-api-kappa-one.vercel.app";

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Anime API — Docs</title>
  <meta name="description" content="Documentação da Anime API (Goyabu). Endpoints: search, episodes, episode-video, sinopse." />
  <style>
    :root{
      --bg0:#070811;
      --bg1:#0b1020;
      --card:rgba(255,255,255,.06);
      --card2:rgba(255,255,255,.08);
      --stroke:rgba(255,255,255,.10);
      --text:#eaf0ff;
      --muted:rgba(234,240,255,.72);
      --muted2:rgba(234,240,255,.55);
      --blue:#4f7cff;
      --green:#29d391;
      --red:#ff4f7a;
      --yellow:#ffd34f;
      --radius:18px;
      --shadow: 0 30px 90px rgba(0,0,0,.55);
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family:var(--sans);
      color:var(--text);
      background:
        radial-gradient(900px 420px at 18% -10%, rgba(79,124,255,.22), transparent 55%),
        radial-gradient(900px 520px at 95% 10%, rgba(41,211,145,.18), transparent 55%),
        radial-gradient(820px 520px at 55% 115%, rgba(255,79,122,.12), transparent 55%),
        linear-gradient(180deg, var(--bg0), var(--bg1));
      overflow-x:hidden;
    }
    a{color:inherit;text-decoration:none}
    .wrap{max-width:1100px;margin:0 auto;padding:28px 18px 60px}
    .top{
      display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;
      padding:18px 18px 6px;
      border:1px solid var(--stroke);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
      border-radius:calc(var(--radius) + 6px);
      box-shadow:var(--shadow);
      position:relative;
      overflow:hidden;
    }
    .top:before{
      content:"";
      position:absolute;inset:-2px;
      background: radial-gradient(600px 220px at 25% 0%, rgba(79,124,255,.28), transparent 60%),
                  radial-gradient(540px 220px at 90% 15%, rgba(41,211,145,.20), transparent 60%);
      filter: blur(16px);
      opacity:.9;
      pointer-events:none;
    }
    .top > *{position:relative}
    .brand{
      display:flex;flex-direction:column;gap:10px;min-width:min(520px,100%);
    }
    .kicker{
      display:flex;gap:10px;align-items:center;flex-wrap:wrap;
      color:var(--muted);
      font-size:13px;
      letter-spacing:.2px;
    }
    .pill{
      display:inline-flex;align-items:center;gap:8px;
      padding:7px 10px;
      border:1px solid var(--stroke);
      background:rgba(0,0,0,.18);
      border-radius:999px;
      font-family:var(--mono);
      font-size:12px;
      color:rgba(234,240,255,.78);
    }
    .dot{width:8px;height:8px;border-radius:99px;background:var(--green);box-shadow:0 0 0 4px rgba(41,211,145,.15)}
    h1{margin:0;font-size:28px;letter-spacing:-.4px}
    .sub{
      margin:0;
      color:var(--muted);
      line-height:1.6;
      max-width:66ch;
    }
    .actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}
    .btn{
      display:inline-flex;align-items:center;gap:10px;
      padding:10px 12px;border-radius:12px;
      border:1px solid var(--stroke);
      background:rgba(0,0,0,.20);
      transition:.18s transform ease, .18s background ease;
      font-weight:600;
    }
    .btn:hover{transform:translateY(-1px);background:rgba(255,255,255,.08)}
    .btn small{opacity:.7;font-weight:500}
    .right{
      display:flex;flex-direction:column;gap:10px;align-items:flex-end;
      min-width:220px;flex:1;
    }
    .credit{
      text-align:right;
      color:var(--muted);
      font-size:13px;
    }
    .credit b{color:var(--text)}
    .grid{
      margin-top:18px;
      display:grid;
      grid-template-columns:repeat(12,1fr);
      gap:12px;
    }
    .card{
      grid-column: span 6;
      border:1px solid var(--stroke);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
      border-radius:var(--radius);
      padding:14px 14px 12px;
      box-shadow: 0 10px 35px rgba(0,0,0,.35);
      position:relative;
      overflow:hidden;
    }
    @media (max-width: 860px){ .card{grid-column: span 12;} .right{align-items:flex-start} .credit{text-align:left}}
    .card h3{
      margin:2px 0 6px;
      font-size:16px;
      letter-spacing:-.2px;
      display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    }
    .tag{
      font-family:var(--mono);
      font-size:12px;
      padding:4px 8px;
      border-radius:999px;
      border:1px solid var(--stroke);
      background:rgba(0,0,0,.18);
      color:rgba(234,240,255,.78);
    }
    .desc{margin:0;color:var(--muted);line-height:1.55;font-size:13px}
    .meta{margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}
    .meta .k{color:var(--muted2);font-size:12px}
    pre{
      margin:10px 0 0;
      padding:12px 12px;
      border-radius:14px;
      border:1px solid var(--stroke);
      background:rgba(0,0,0,.30);
      overflow:auto;
      font-family:var(--mono);
      font-size:12.5px;
      line-height:1.55;
      color:rgba(234,240,255,.92);
    }
    .accent-blue{color:var(--blue)}
    .accent-green{color:var(--green)}
    .accent-red{color:var(--red)}
    .accent-yellow{color:var(--yellow)}
    .foot{
      margin-top:14px;
      border:1px solid var(--stroke);
      background:rgba(0,0,0,.18);
      border-radius:var(--radius);
      padding:12px 14px;
      color:var(--muted);
      font-size:13px;
      display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;
    }
    .hint{
      display:flex;gap:10px;align-items:center;flex-wrap:wrap;
      font-family:var(--mono);
      color:rgba(234,240,255,.78);
      font-size:12px;
    }
    .copy{
      cursor:pointer;
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.06);
      padding:7px 10px;border-radius:12px;
      font-weight:700;
    }
    .copy:hover{background:rgba(255,255,255,.10)}
    .toast{
      position:fixed;
      left:50%;
      bottom:20px;
      transform:translateX(-50%);
      padding:10px 12px;
      border-radius:14px;
      border:1px solid var(--stroke);
      background:rgba(0,0,0,.6);
      color:rgba(234,240,255,.9);
      font-family:var(--mono);
      font-size:12px;
      opacity:0;
      pointer-events:none;
      transition:.2s ease;
    }
    .toast.on{opacity:1}
  </style>
</head>
<body>
  <div class="wrap">
    <header class="top">
      <div class="brand">
        <div class="kicker">
          <span class="pill"><span class="dot"></span>status: online</span>
          <span class="pill">base: ${base}</span>
          <span class="pill">source: goyabu.io</span>
        </div>
        <h1>Anime API — Documentation</h1>
        <p class="sub">
          API que extrai dados do site goyabu.io e entrega em JSON para você consumir no seu site/app.
          Endpoints prontos para busca, episódios, vídeo e sinopse.
        </p>
        <div class="actions">
          <a class="btn" href="/api/search?keyword=overlord">Testar search <small>(overlord)</small></a>
          <a class="btn" href="/api/intro">Recarregar docs <small>(/api/intro)</small></a>
        </div>
      </div>

      <div class="right">
        <div class="credit">
          Credits: <b>DVHACKZ</b><br/>
          <span style="opacity:.7">All rights reserved.</span>
        </div>
        <div class="pill">version: 1.0</div>
      </div>
    </header>

    <section class="grid">
      <article class="card">
        <h3><span class="accent-blue">GET</span> /api/search <span class="tag">keyword</span></h3>
        <p class="desc">Busca anime por palavra-chave usando o endpoint wp-json do site.</p>
        <div class="meta"><span class="k">Exemplo</span></div>
        <pre id="c1">${base}/api/search?keyword=overlord</pre>
      </article>

      <article class="card">
        <h3><span class="accent-green">GET</span> /api/episodes <span class="tag">anime_id</span></h3>
        <p class="desc">Lista episódios pelo anime_id via admin-ajax (action=get_anime_episodes).</p>
        <div class="meta"><span class="k">Exemplo</span></div>
        <pre id="c2">${base}/api/episodes?anime_id=69624</pre>
      </article>

      <article class="card">
        <h3><span class="accent-red">GET</span> /api/episode-video <span class="tag">episode_id</span></h3>
        <p class="desc">
          Extrai link do vídeo do episódio. Tenta primeiro o iframe criptografado e depois token do blogger.
        </p>
        <div class="meta"><span class="k">Exemplo</span></div>
        <pre id="c3">${base}/api/episode-video?episode_id=123456</pre>
      </article>

      <article class="card">
        <h3><span class="accent-yellow">GET</span> /api/sinopse/NOME_DO_ANIME</h3>
        <p class="desc">
          Retorna apenas <b>title</b> e <b>sinopse</b>. O nome é convertido em slug automaticamente.
          Ex: "isekai dark web" vira "isekai-dark-web".
        </p>
        <div class="meta"><span class="k">Exemplo</span></div>
        <pre id="c4">${base}/api/sinopse/isekai%20dark%20web</pre>
      </article>
    </section>

    <div class="foot">
      <div>
        <b>Nota</b>: se algum slug não existir no site, a sinopse pode retornar 404.
        Nesses casos, o ideal é usar <span class="accent-blue">/api/search</span> para descobrir o nome correto.
      </div>
      <div class="hint">
        click to copy:
        <button class="copy" data-copy="c1">search</button>
        <button class="copy" data-copy="c2">episodes</button>
        <button class="copy" data-copy="c3">episode-video</button>
        <button class="copy" data-copy="c4">sinopse</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast">copied</div>

  <script>
    const toast = document.getElementById("toast");
    function showToast(msg){
      toast.textContent = msg;
      toast.classList.add("on");
      clearTimeout(window.__t);
      window.__t = setTimeout(()=>toast.classList.remove("on"), 900);
    }
    document.querySelectorAll(".copy").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        const id = btn.getAttribute("data-copy");
        const el = document.getElementById(id);
        const text = el ? el.textContent.trim() : "";
        try{
          await navigator.clipboard.writeText(text);
          showToast("copied: " + btn.textContent);
        }catch(e){
          showToast("copy failed");
        }
      });
    });
  </script>
</body>
</html>`;

  return res.status(200).end(html);
};
