module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const base = "https://anime-api-kappa-one.vercel.app";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>documentação · anime api</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            background: #f5f7fb;
            color: #111827;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            padding: 2rem;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 2rem;
        }

        .sidebar {
            background: #ffffff;
            border-radius: 20px;
            padding: 2rem 1.25rem;
            box-shadow: 0 15px 35px -15px rgba(0,10,30,0.08);
            height: fit-content;
            position: sticky;
            top: 2rem;
            border: 1px solid rgba(0,0,0,0.02);
        }

        .brand {
            padding: 0 0.75rem 1.25rem;
            margin-bottom: 1.25rem;
            border-bottom: 1px solid #edf2f9;
        }
        .brand .title {
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #0b1e33;
            font-size: 1.05rem;
            display:flex;
            align-items:center;
            gap:.6rem;
        }
        .brand .pill {
            font-size: .72rem;
            font-weight: 600;
            padding: .22rem .6rem;
            border-radius: 999px;
            background: #edf4fe;
            color: #2266cc;
            border: 1px solid #ccdefa;
        }
        .brand .meta {
            margin-top: .6rem;
            color: #6b7a8f;
            font-size: .85rem;
            line-height: 1.4;
        }
        .brand .base {
            margin-top: .65rem;
            display:flex;
            gap:.55rem;
            align-items:center;
        }
        .basecode {
            font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
            font-size: .78rem;
            background: #0c121c;
            color: #deecff;
            padding: .5rem .65rem;
            border-radius: 12px;
            border: 1px solid #1e2a3a;
            overflow:hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex:1;
        }
        .copybtn{
            border: 1px solid #d7e2ec;
            background: #ffffff;
            color: #0b1e33;
            font-weight: 600;
            font-size: .78rem;
            padding: .5rem .7rem;
            border-radius: 12px;
            cursor:pointer;
            transition:.15s;
        }
        .copybtn:hover{ background:#f0f4fe; border-color:#cbddee; }
        .copybtn:active{ transform: translateY(1px); }

        .sidebar-section { margin-bottom: 2rem; }
        .sidebar-section-title {
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #6b7a8f;
            margin-bottom: 1rem;
            padding-left: 0.75rem;
        }

        .sidebar-nav { list-style: none; }
        .sidebar-nav-item { margin-bottom: 0.2rem; }
        .sidebar-nav-link {
            display: block;
            padding: 0.6rem 0.75rem;
            color: #334155;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 450;
            border-radius: 12px;
            transition: all 0.15s ease;
            border-left: 2px solid transparent;
        }
        .sidebar-nav-link:hover {
            background: #f0f4fe;
            border-left-color: #2266cc;
            color: #0b1e33;
        }
        .sidebar-nav-link.active {
            background: #f0f4fe;
            border-left-color: #2266cc;
            color: #0b1e33;
            font-weight: 500;
        }

        .content {
            background: #ffffff;
            border-radius: 32px;
            padding: 3rem;
            box-shadow: 0 20px 40px -20px rgba(0,20,40,0.12);
            border: 1px solid rgba(0,0,0,0.02);
        }

        .section-title {
            font-size: 2rem;
            font-weight: 600;
            letter-spacing: -0.015em;
            margin-bottom: 1.5rem;
            color: #0b1e33;
            border-bottom: 2px solid #edf2f9;
            padding-bottom: 0.75rem;
        }

        .subsection-title {
            font-size: 1.35rem;
            font-weight: 600;
            margin: 2.5rem 0 1rem 0;
            color: #1f2a44;
            letter-spacing: -0.01em;
        }

        .text-large {
            font-size: 1.05rem;
            color: #2d3c54;
            margin-bottom: 1.5rem;
        }

        .endpoint-card {
            background: #f9fcff;
            border-radius: 20px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 1px solid #e4edf5;
            transition: all 0.2s;
        }
        .endpoint-card:hover {
            border-color: #cbddee;
            background: #ffffff;
            box-shadow: 0 10px 25px -15px #1e3a8a30;
        }
        .endpoint-head{
            display:flex;
            align-items:center;
            gap: .75rem;
            flex-wrap: wrap;
        }
        .endpoint-method {
            display: inline-block;
            font-weight: 600;
            font-size: 0.7rem;
            padding: 0.25rem 0.9rem;
            border-radius: 30px;
            background: #0b1e33;
            color: white;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            margin-right: .25rem;
            border: 1px solid #1e3a5f;
        }
        .endpoint-path {
            font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
            font-size: 1.05rem;
            color: #0b1e33;
            font-weight: 600;
        }
        .endpoint-actions{
            margin-left:auto;
            display:flex;
            gap:.5rem;
        }
        .btn{
            border: 1px solid #d7e2ec;
            background: #ffffff;
            color: #0b1e33;
            font-weight: 650;
            font-size: .78rem;
            padding: .45rem .7rem;
            border-radius: 12px;
            cursor:pointer;
            transition:.15s;
            text-decoration:none;
            display:inline-flex;
            align-items:center;
            gap:.45rem;
        }
        .btn:hover{ background:#f0f4fe; border-color:#cbddee; }
        .btn:active{ transform: translateY(1px); }
        .endpoint-description {
            margin: 0.75rem 0 0 0;
            color: #4a5b74;
            font-size: 0.95rem;
        }

        .code-block {
            background: #0c121c;
            color: #deecff;
            padding: 1.5rem;
            border-radius: 18px;
            font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid #1e2a3a;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
        }
        .code-block code { color: #b7d1f0; }

        .params-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.9rem;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2eaf2;
        }
        .params-table th {
            text-align: left;
            padding: 0.9rem 1.2rem;
            background: #f4f9ff;
            border-bottom: 1px solid #d7e2ec;
            color: #1a2b40;
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        .params-table td {
            padding: 0.9rem 1.2rem;
            border-bottom: 1px solid #e2eaf2;
            color: #2b3d55;
            vertical-align: top;
        }
        .params-table tr:last-child td { border-bottom: none; }

        .param-required {
            color: #cc2e4a;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 0.5rem;
            background: #ffeef0;
            padding: 0.15rem 0.5rem;
            border-radius: 30px;
            display: inline-block;
        }

        .tip-box {
            background: #edf4fe;
            border-radius: 16px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 1px solid #ccdefa;
        }
        .tip-box strong {
            color: #0f2b4f;
            display: block;
            margin-bottom: 0.3rem;
            font-size: 1rem;
            font-weight: 600;
        }
        .tip-box p { color: #1f3a5f; font-size: 0.95rem; }
        .tip-box a {
            color: #2266cc;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid transparent;
            transition: border 0.1s;
        }
        .tip-box a:hover { border-bottom-color: #2266cc; }

        .grid-2{
            display:grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            margin: 1.25rem 0;
        }
        .mini{
            background:#ffffff;
            border:1px solid #e4edf5;
            border-radius: 18px;
            padding: 1.25rem;
        }
        .mini h4{
            font-size: .95rem;
            color:#0b1e33;
            margin-bottom:.4rem;
            font-weight: 700;
        }
        .mini p{
            color:#4a5b74;
            font-size:.9rem;
        }
        .tag{
            display:inline-flex;
            align-items:center;
            gap:.4rem;
            padding:.25rem .6rem;
            border-radius: 999px;
            font-size:.75rem;
            font-weight:700;
            background:#f0f4fe;
            border:1px solid #ccdefa;
            color:#2266cc;
        }

        .footer {
            max-width: 1400px;
            margin: 2rem auto 0;
            padding: 2rem 0 0;
            color: #718096;
            font-size: 0.8rem;
            text-align: center;
            border-top: 1px solid #e2eaf2;
        }
        .footer a {
            color: #2b3d55;
            text-decoration: none;
            margin: 0 0.75rem;
            font-weight: 450;
        }
        .footer a:hover { color: #0b1e33; }

        @media (max-width: 900px) {
            body { padding: 1rem; }
            .container { grid-template-columns: 1fr; }
            .sidebar { position: relative; top: 0; }
            .content { padding: 2rem; }
            .grid-2{ grid-template-columns: 1fr; }
            .endpoint-actions{ width:100%; margin-left:0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <aside class="sidebar">
            <div class="brand">
                <div class="title">Anime API <span class="pill">docs</span></div>
                <div class="meta">Endpoints para buscar animes, episódios, lançamentos e link de vídeo.</div>
                <div class="base">
                    <div class="basecode" id="basecode">${base}</div>
                    <button class="copybtn" id="copyBase">copiar</button>
                </div>
            </div>

            <div class="sidebar-section">
                <div class="sidebar-section-title">Primeiros passos</div>
                <ul class="sidebar-nav">
                    <li class="sidebar-nav-item"><a href="#introducao" class="sidebar-nav-link active">Introdução</a></li>
                    <li class="sidebar-nav-item"><a href="#fluxo" class="sidebar-nav-link">Fluxo (nome → vídeo)</a></li>
                    <li class="sidebar-nav-item"><a href="#boaspraticas" class="sidebar-nav-link">Boas práticas</a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <div class="sidebar-section-title">Endpoints</div>
                <ul class="sidebar-nav">
                    <li class="sidebar-nav-item"><a href="#search" class="sidebar-nav-link">Search</a></li>
                    <li class="sidebar-nav-item"><a href="#episodes" class="sidebar-nav-link">Episódios</a></li>
                    <li class="sidebar-nav-item"><a href="#episodevideo" class="sidebar-nav-link">Vídeo do episódio</a></li>
                    <li class="sidebar-nav-item"><a href="#lancamentos" class="sidebar-nav-link">Lançamentos</a></li>
                    <li class="sidebar-nav-item"><a href="#sinopse" class="sidebar-nav-link">Sinopse</a></li>
                    <li class="sidebar-nav-item"><a href="#generos" class="sidebar-nav-link">Gêneros</a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <div class="sidebar-section-title">Referência</div>
                <ul class="sidebar-nav">
                    <li class="sidebar-nav-item"><a href="#respostas" class="sidebar-nav-link">Respostas</a></li>
                    <li class="sidebar-nav-item"><a href="#erros" class="sidebar-nav-link">Erros</a></li>
                    <li class="sidebar-nav-item"><a href="#changelog" class="sidebar-nav-link">Changelog</a></li>
                </ul>
            </div>
        </aside>

        <main class="content">
            <section id="introducao">
                <h2 class="section-title">Introdução</h2>
                <p class="text-large">
                    Documentação oficial da <strong>Anime API</strong>. Aqui você encontra a ordem certa para
                    pesquisar um anime, listar episódios e finalmente obter o <strong>link do vídeo</strong>.
                </p>

                <div class="tip-box">
                    <strong>Base URL</strong>
                    <p>
                        Todas as rotas começam com <code>${base}</code>. Exemplo:
                        <a href="${base}/api/search?keyword=overlord" target="_blank" rel="noreferrer">/api/search?keyword=overlord</a>
                    </p>
                </div>

                <div class="grid-2">
                    <div class="mini">
                        <h4><span class="tag">JSON</span></h4>
                        <p>As rotas retornam JSON. Endpoints de documentação retornam HTML.</p>
                    </div>
                    <div class="mini">
                        <h4><span class="tag">GET</span></h4>
                        <p>Rotas são acessadas via query params (<code>?chave=valor</code>).</p>
                    </div>
                </div>
            </section>

            <section id="fluxo" style="margin-top: 3.5rem;">
                <h2 class="section-title">Fluxo (nome → vídeo)</h2>
                <p class="text-large">
                    A ordem correta é sempre:
                    <strong>Nome</strong> → <strong>anime_id</strong> → <strong>episodes</strong> → <strong>episode_id</strong> → <strong>video_url</strong>.
                </p>

                <h3 class="subsection-title">1) Buscar pelo nome (Search)</h3>
                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/search?keyword=overlord</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/search?keyword=overlord" target="_blank" rel="noreferrer">abrir</a>
                            <button class="btn" data-copy="${base}/api/search?keyword=overlord">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">
                        Retorna lista/objeto de animes compatíveis com a busca. Pegue o <strong>id</strong> do anime desejado (isso é o <strong>anime_id</strong>).
                    </div>
                </div>

                <h3 class="subsection-title">2) Usar anime_id para listar episódios</h3>
                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/episodes?anime_id=40927</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/episodes?anime_id=40927" target="_blank" rel="noreferrer">abrir</a>
                            <button class="btn" data-copy="${base}/api/episodes?anime_id=40927">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">
                        Retorna os episódios do anime. Cada episódio vem com um <strong>id</strong> próprio (isso é o <strong>episode_id</strong>).
                    </div>
                </div>

                <h3 class="subsection-title">3) Usar episode_id para pegar o vídeo</h3>
                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/episode-video?episode_id=40930</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/episode-video?episode_id=40930" target="_blank" rel="noreferrer">abrir</a>
                            <button class="btn" data-copy="${base}/api/episode-video?episode_id=40930">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">
                        Retorna <strong>video_url</strong>. Esse link é o que você coloca no seu player (iframe/video).
                    </div>
                </div>

                <div class="tip-box">
                    <strong>Exemplo rápido (passo a passo)</strong>
                    <p>
                        1) Pesquise: <code>keyword=overlord</code> → copie o <code>id</code> do anime.<br>
                        2) Cole em <code>/api/episodes?anime_id=SEU_ID</code> → copie o <code>id</code> do episódio.<br>
                        3) Cole em <code>/api/episode-video?episode_id=SEU_EP_ID</code> → use <code>video_url</code>.
                    </p>
                </div>
            </section>

            <section id="boaspraticas" style="margin-top: 3.5rem;">
                <h2 class="section-title">Boas práticas</h2>
                <p class="text-large">
                    Dicas para deixar seu app mais rápido e estável consumindo a API:
                </p>
                <ul style="margin-left: 1.5rem; color: #2d3c54;">
                    <li><strong>Cache</strong>: salve o retorno de <code>search</code> e <code>episodes</code> localmente por alguns minutos.</li>
                    <li><strong>Debounce</strong>: na busca do usuário, espere ~300ms antes de chamar <code>/search</code>.</li>
                    <li><strong>Fallback</strong>: se o vídeo falhar, tente recarregar/alternar player no seu front.</li>
                    <li><strong>Paginação</strong>: use <code>/lancamentos</code> paginado para evitar carga pesada.</li>
                </ul>
            </section>

            <section id="search" style="margin-top: 3.5rem;">
                <h2 class="section-title">Search</h2>
                <p class="text-large">Busca animes por palavra-chave. Retorna itens com <strong>id</strong> e flag <strong>dublado</strong> (true/false).</p>

                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/search?keyword={texto}</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/search?keyword=overlord" target="_blank" rel="noreferrer">teste</a>
                            <button class="btn" data-copy="${base}/api/search?keyword=overlord">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">Use <code>keyword</code> para pesquisar. Recomenda-se tratar acentos no front e usar termos simples.</div>
                </div>

                <table class="params-table">
                    <thead><tr><th>Parâmetro</th><th>Tipo</th><th>Descrição</th></tr></thead>
                    <tbody>
                        <tr><td>keyword <span class="param-required">obrigatório</span></td><td>string</td><td>Termo de busca (ex: overlord)</td></tr>
                        <tr><td>limite</td><td>number</td><td>Opcional (se implementado no endpoint). Limita quantidade retornada.</td></tr>
                    </tbody>
                </table>

                <div class="code-block"><code>GET ${base}/api/search?keyword=overlord</code></div>
            </section>

            <section id="episodes" style="margin-top: 3.5rem;">
                <h2 class="section-title">Episódios</h2>
                <p class="text-large">Lista episódios de um anime usando <strong>anime_id</strong>.</p>

                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/episodes?anime_id={id}</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/episodes?anime_id=40927" target="_blank" rel="noreferrer">teste</a>
                            <button class="btn" data-copy="${base}/api/episodes?anime_id=40927">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">Retorna lista com <code>id</code> (episode_id), número do episódio, áudio e outras infos.</div>
                </div>

                <table class="params-table">
                    <thead><tr><th>Parâmetro</th><th>Tipo</th><th>Descrição</th></tr></thead>
                    <tbody>
                        <tr><td>anime_id <span class="param-required">obrigatório</span></td><td>number</td><td>ID do anime obtido em <code>/search</code></td></tr>
                        <tr><td>limite</td><td>number</td><td>Opcional (se você limitar no endpoint)</td></tr>
                    </tbody>
                </table>

                <div class="code-block"><code>GET ${base}/api/episodes?anime_id=40927</code></div>
            </section>

            <section id="episodevideo" style="margin-top: 3.5rem;">
                <h2 class="section-title">Vídeo do episódio</h2>
                <p class="text-large">Retorna o link final do vídeo para assistir, usando <strong>episode_id</strong>.</p>

                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/episode-video?episode_id={id}</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/episode-video?episode_id=40930" target="_blank" rel="noreferrer">teste</a>
                            <button class="btn" data-copy="${base}/api/episode-video?episode_id=40930">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">Resposta: <code>{ success: true, video_url: "..." }</code></div>
                </div>

                <table class="params-table">
                    <thead><tr><th>Parâmetro</th><th>Tipo</th><th>Descrição</th></tr></thead>
                    <tbody>
                        <tr><td>episode_id <span class="param-required">obrigatório</span></td><td>number</td><td>ID do episódio obtido em <code>/episodes</code></td></tr>
                    </tbody>
                </table>

                <div class="code-block"><code>GET ${base}/api/episode-video?episode_id=40930</code></div>
            </section>

            <section id="lancamentos" style="margin-top: 3.5rem;">
                <h2 class="section-title">Lançamentos</h2>
                <p class="text-large">Lista episódios recentes com paginação (<code>pagina</code>) e limite (<code>limite</code>).</p>

                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/lancamentos?pagina=1&limite=20</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/lancamentos?pagina=1&limite=20" target="_blank" rel="noreferrer">teste</a>
                            <button class="btn" data-copy="${base}/api/lancamentos?pagina=1&limite=20">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">Retorna <code>dados</code> com episódios e metadados (total_paginas, total_retornado, etc.).</div>
                </div>

                <table class="params-table">
                    <thead><tr><th>Parâmetro</th><th>Tipo</th><th>Descrição</th></tr></thead>
                    <tbody>
                        <tr><td>pagina</td><td>number</td><td>Página (padrão: 1)</td></tr>
                        <tr><td>limite</td><td>number</td><td>Quantidade por página (ex: 5, 10, 20, 30)</td></tr>
                    </tbody>
                </table>
            </section>

            <section id="sinopse" style="margin-top: 3.5rem;">
                <h2 class="section-title">Sinopse</h2>
                <p class="text-large">Busca título e sinopse do anime via slug (nome com hífen).</p>

                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/sinopse?nome=Overlord-4-Dublado</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/sinopse?nome=Overlord-4-Dublado" target="_blank" rel="noreferrer">teste</a>
                            <button class="btn" data-copy="${base}/api/sinopse?nome=Overlord-4-Dublado">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">No seu backend, o nome é “slugificado”. Você pode mandar com espaço também e deixar o backend normalizar.</div>
                </div>

                <table class="params-table">
                    <thead><tr><th>Parâmetro</th><th>Tipo</th><th>Descrição</th></tr></thead>
                    <tbody>
                        <tr><td>nome <span class="param-required">obrigatório</span></td><td>string</td><td>Nome/slug do anime</td></tr>
                    </tbody>
                </table>
            </section>

            <section id="generos" style="margin-top: 3.5rem;">
                <h2 class="section-title">Gêneros</h2>
                <p class="text-large">Lista animes por gênero.</p>

                <div class="endpoint-card">
                    <div class="endpoint-head">
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/generos?genero=acao</span>
                        <div class="endpoint-actions">
                            <a class="btn" href="${base}/api/generos?genero=acao" target="_blank" rel="noreferrer">teste</a>
                            <button class="btn" data-copy="${base}/api/generos?genero=acao">copiar</button>
                        </div>
                    </div>
                    <div class="endpoint-description">Retorna lista com <code>titulo</code> e <code>url</code>.</div>
                </div>

                <table class="params-table">
                    <thead><tr><th>Parâmetro</th><th>Tipo</th><th>Descrição</th></tr></thead>
                    <tbody>
                        <tr><td>genero <span class="param-required">obrigatório</span></td><td>string</td><td>Slug do gênero (ex: acao, romance, comedia)</td></tr>
                    </tbody>
                </table>
            </section>

            <section id="respostas" style="margin-top: 3.5rem;">
                <h2 class="section-title">Respostas</h2>
                <p class="text-large">Formato típico (exemplo do endpoint de lançamentos):</p>
                <div class="code-block"><code>{
  "sucesso": true,
  "pagina": 1,
  "total_paginas": 1571,
  "total_disponivel": 30,
  "total_retornado": 20,
  "limite": 20,
  "dados": [
    {
      "id": "12345",
      "titulo": "Anime X",
      "link": "https://goyabu.io/12345",
      "episodio": "1",
      "dublado": false,
      "thumb": "...",
      "data_publicacao": "..."
    }
  ]
}</code></div>
            </section>

            <section id="erros" style="margin-top: 3.5rem;">
                <h2 class="section-title">Erros</h2>
                <p class="text-large">Erros comuns:</p>

                <table class="params-table">
                    <thead><tr><th>Status</th><th>Quando acontece</th><th>Como resolver</th></tr></thead>
                    <tbody>
                        <tr><td>400</td><td>Parâmetro obrigatório ausente (ex: keyword, anime_id, episode_id)</td><td>Envie o parâmetro correto na query string</td></tr>
                        <tr><td>404</td><td>Anime não encontrado (sinopse)</td><td>Revise o slug/nome informado</td></tr>
                        <tr><td>500</td><td>Falha de scraping/timeout</td><td>Tente novamente / implemente retry no front</td></tr>
                    </tbody>
                </table>

                <div class="tip-box">
                    <strong>Dica</strong>
                    <p>Se seu front depende do vídeo, trate carregamento com fallback e estado de erro amigável.</p>
                </div>
            </section>

            <section id="changelog" style="margin-top: 3.5rem;">
                <h2 class="section-title">Changelog</h2>
                <div class="endpoint-card">
                    <div class="endpoint-description">
                        <strong>v3</strong> • Documentação interativa, botões de copiar, fluxo completo detalhado.<br>
                        <strong>v2</strong> • Lançamentos com paginação/limite.<br>
                        <strong>v1</strong> • Search / Episodes / Episode-video.
                    </div>
                </div>
            </section>
        </main>
    </div>

    <footer class="footer">
        <div>
            <a href="${base}/api/intro">docs</a> ·
            <a href="${base}/api/search?keyword=overlord">search</a> ·
            <a href="${base}/api/lancamentos?pagina=1&limite=20">lancamentos</a> ·
            <a href="${base}/api/generos?genero=acao">generos</a>
        </div>
        <div style="margin-top: 1.5rem; color: #8b9bb0;">
            © 2026 anime api · developer by <strong>Lopes</strong> · <strong>DVHACKZZ</strong>
        </div>
    </footer>

<script>
(function(){
  const links = Array.from(document.querySelectorAll('.sidebar-nav-link'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActive(hash){
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === hash));
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href[0] !== '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', href);
      el.scrollIntoView({ behavior:'smooth', block:'start' });
      setActive(href);
    });
  });

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible && visible.target && visible.target.id) {
      const hash = '#' + visible.target.id;
      setActive(hash);
      if (location.hash !== hash) history.replaceState(null, '', hash);
    }
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.1,0.2,0.35,0.5,0.65] });

  sections.forEach(s => io.observe(s));

  const copyBase = document.getElementById('copyBase');
  const basecode = document.getElementById('basecode');
  if (copyBase && basecode) {
    copyBase.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(basecode.textContent.trim());
        copyBase.textContent = 'copiado';
        setTimeout(() => copyBase.textContent = 'copiar', 900);
      }catch{
        copyBase.textContent = 'erro';
        setTimeout(() => copyBase.textContent = 'copiar', 900);
      }
    });
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      if (!text) return;
      const old = btn.textContent;
      try{
        await navigator.clipboard.writeText(text);
        btn.textContent = 'copiado';
        setTimeout(() => btn.textContent = old, 900);
      }catch{
        btn.textContent = 'erro';
        setTimeout(() => btn.textContent = old, 900);
      }
    });
  });

  if (location.hash) setActive(location.hash);
})();
</script>
</body>
</html>`;

  return res.status(200).end(html);
};
