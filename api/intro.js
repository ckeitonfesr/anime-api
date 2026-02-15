module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const base = "https://anime-api-kappa-one.vercel.app";

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Anime API - Documentação</title>
  <style>
    :root{
      --bg:#070912;
      --text:#eaf1ff;
      --muted:rgba(234,241,255,.7);
      --line:rgba(255,255,255,.12);
      --panel:rgba(255,255,255,.06);
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      --highlight: #8b5cf6;
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
    h1{margin:0;font-size:22px}
    .sub{margin:6px 0 0;color:var(--muted);font-size:13px;line-height:1.55}
    .item{
      border:1px solid var(--line);
      background:rgba(0,0,0,.18);
      padding:12px 12px;
      border-radius:14px;
      margin-top:10px;
    }
    .k{
      font-weight:800;
      font-size:14px;
      margin:0 0 6px;
      color: var(--highlight);
    }
    .d{margin:0;color:var(--muted);font-size:13px;line-height:1.55}
    pre{
      margin:8px 0 0;
      padding:10px 12px;
      border-radius:12px;
      border:1px solid var(--line);
      background:rgba(0,0,0,.45);
      overflow:auto;
      font-family:var(--mono);
      font-size:12.5px;
      color:#fff;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .badge {
      display: inline-block;
      background: var(--highlight);
      color: #fff;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 20px;
      margin-left: 8px;
      vertical-align: middle;
    }
    a{color:inherit}
    .foot{
      margin-top:16px;
      color:rgba(234,255,255,.5);
      font-family:var(--mono);
      font-size:12px;
      text-align: center;
    }
    hr {
      border: none;
      border-top: 1px solid var(--line);
      margin: 16px 0 8px;
    }
    .params {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 6px;
    }
    .params strong {
      color: #d1d5db;
    }
  </style>
</head>
<body>
  <div class="wrap">

    <div class="top">
      <h1>🎬 Anime API</h1>
      <p class="sub">Documentação completa. Todas as rotas retornam JSON.<br>Base URL: <strong>${base}</strong></p>
    </div>

    <!-- LANÇAMENTOS (NOVO) -->
    <div class="item">
      <p class="k">📅 Lançamentos <span class="badge">NOVO</span></p>
      <p class="d">Lista episódios recentes com paginação e limite personalizável.</p>
      <pre>${base}/api/lancamentos?pagina=10</pre>
      <pre>${base}/api/lancamentos?pagina=11&limite=5</pre>
      <div class="params">
        <strong>Parâmetros:</strong><br>
        • <code>pagina</code> (opcional) - Número da página (padrão: 1)<br>
        • <code>limite</code> (opcional) - Máximo de episódios por página (padrão: 20, máx: 30)<br><br>
        <strong>Resposta inclui:</strong> total_paginas, total_disponivel, total_retornado, limite aplicado
      </div>
    </div>

    <!-- SEARCH -->
    <div class="item">
      <p class="k">🔍 Search</p>
      <p class="d">Busca animes por palavra-chave.</p>
      <pre>${base}/api/search?keyword=overlord</pre>
      <pre>${base}/api/search?keyword=naruto&limite=5</pre>
      <div class="params">
        <strong>Parâmetros:</strong> <code>keyword</code> (obrigatório), <code>limite</code> (opcional)
      </div>
    </div>

    <!-- EPISODES -->
    <div class="item">
      <p class="k">📺 Episódios</p>
      <p class="d">Lista todos os episódios de um anime específico.</p>
      <pre>${base}/api/episodes?anime_id=40927</pre>
      <pre>${base}/api/episodes?anime_id=40927&limite=10</pre>
      <div class="params">
        <strong>Parâmetros:</strong> <code>anime_id</code> (obrigatório), <code>limite</code> (opcional)
      </div>
    </div>

    <!-- EPISODE VIDEO -->
    <div class="item">
      <p class="k">🎥 Vídeo do Episódio</p>
      <p class="d">Retorna o link direto do vídeo para assistir.</p>
      <pre>${base}/api/episode-video?episode_id=40930</pre>
      <div class="params">
        <strong>Parâmetro:</strong> <code>episode_id</code> (obrigatório)
      </div>
    </div>

    <!-- SINOPSE -->
    <div class="item">
      <p class="k">📖 Sinopse</p>
      <p class="d">Busca detalhes do anime pelo nome. Espaços viram hífen automaticamente.</p>
      <pre>${base}/api/sinopse?nome=Overlord-4-Dublado</pre>
      <pre>${base}/api/sinopse?nome=Solo-Leveling-2</pre>
      <div class="params">
        <strong>Parâmetro:</strong> <code>nome</code> (obrigatório) - Use hífen no lugar dos espaços
      </div>
    </div>

    <!-- EXEMPLO DE RESPOSTA -->
    <div class="item">
      <p class="k">📦 Exemplo de resposta (Lancamentos)</p>
      <pre>{
  "sucesso": true,
  "pagina": 10,
  "total_paginas": 1571,
  "total_disponivel": 30,
  "total_retornado": 20,
  "limite": 20,
  "dados": [...]
}</pre>
    </div>

    <hr />

    <div class="foot">
      🚀 Desenvolvido por DVHACKZZ • Discord: dvhackzz<br>
      <span style="opacity:0.5">v2.0 - com paginação e limites</span>
    </div>

  </div>
</body>
</html>`;

  return res.status(200).end(html);
};
