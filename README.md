<br>

<p align="center">
  <img src="https://i.ibb.co/6RgzrZ7d/baixados.jpg" width="120" style="border-radius: 24px;" />
</p>

<h1 align="center">Anime API · Documentação</h1>

<p align="center">
  <strong>Busca animes, episódios, lançamentos e link de vídeo.</strong><br>
  API simples e rápida para consumir conteúdo de animes.
</p>

<p align="center">
  <a href="#-endpoints">Endpoints</a> •
  <a href="#-fluxo-básico">Fluxo</a> •
  <a href="#-exemplos-de-uso">Exemplos</a> •
  <a href="#-respostas">Respostas</a> •
  <a href="#-erros">Erros</a>
</p>

<br>

## 📦 Base URL
https://anime-api-kappa-one.vercel.app

text

Copiar

Baixar

> Todos os endpoints partem dessa URL base.

<br>

## 🚀 Primeiros passos

### 1. Buscar um anime
`GET /api/search?keyword={nome}`

### 2. Listar episódios
`GET /api/episodes?anime_id={id}`

### 3. Pegar link do vídeo
`GET /api/episode-video?episode_id={id}`

<br>

## 📚 Endpoints

### 🔍 Search
Busca por palavra-chave. Retorna animes com `id` e informações básicas.
GET /api/search?keyword=overlord

text

Copiar

Baixar

| Parâmetro | Tipo   | Obrigatório | Descrição        |
|-----------|--------|-------------|------------------|
| `keyword` | string | ✅          | Termo de busca   |

**Exemplo de resposta:**
```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 40927,
      "titulo": "Overlord IV",
      "dublado": true,
      "url": "/anime/overlord-4-dublado"
    }
  ]
}

📺 Episódios
Lista episódios de um anime específico.

text

Copiar

Baixar
GET /api/episodes?anime_id=40927
Parâmetro	Tipo	Obrigatório	Descrição
anime_id	number	✅	ID obtido no /search
Exemplo de resposta:

json

Copiar

Baixar
{
  "sucesso": true,
  "dados": [
    {
      "id": 40930,
      "numero": 1,
      "titulo": "O Rei Morto"
    }
  ]
}

🎬 Vídeo do episódio
Retorna o link direto para o vídeo do episódio.

text

Copiar

Baixar
GET /api/episode-video?episode_id=40930
Parâmetro	Tipo	Obrigatório	Descrição
episode_id	number	✅	ID obtido no /episodes
Exemplo de resposta:

json

Copiar

Baixar
{
  "sucesso": true,
  "video_url": "https://cdn.anime.com/video/overlord-4-ep-1.mp4"
}

🔥 Lançamentos
Endpoint com paginação. Retorna os animes mais recentes.

text

Copiar

Baixar
GET /api/lancamentos?pagina=1&limite=20
Parâmetro	Tipo	Obrigatório	Padrão	Descrição
pagina	number	❌	1	Número da página
limite	number	❌	30	Itens por página

📖 Sinopse
Busca sinopse detalhada pelo nome do anime (slug).

text

Copiar

Baixar
GET /api/sinopse?nome=Overlord-4-Dublado
Parâmetro	Tipo	Obrigatório	Descrição
nome	string	✅	Slug do anime (url-friendly)

🏷️ Gêneros
Lista animes por gênero.

text

Copiar

Baixar
GET /api/generos?genero=acao
Parâmetro	Tipo	Obrigatório	Descrição
genero	string	✅	Gênero desejado (ex: acao, romance, comedia)

🔁 Fluxo básico
Diagrama
Código

Baixar

Tela cheia
Nome do anime

/api/search

anime_id

/api/episodes

episode_id

/api/episode-video

video_url


📦 Exemplos de uso
cURL
bash

Copiar

Baixar
curl "https://anime-api-kappa-one.vercel.app/api/search?keyword=overlord"
JavaScript (fetch)
js

Copiar

Baixar
fetch("https://anime-api-kappa-one.vercel.app/api/episodes?anime_id=40927")
  .then(res => res.json())
  .then(data => console.log(data));
Python
python

Copiar

Baixar
import requests

response = requests.get("https://anime-api-kappa-one.vercel.app/api/episode-video?episode_id=40930")
data = response.json()
print(data["video_url"])

📬 Respostas
✅ Sucesso
json

Copiar

Baixar
{
  "sucesso": true,
  "dados": [...]
}
❌ Erro
json

Copiar

Baixar
{
  "sucesso": false,
  "erro": "mensagem descritiva"
}

⚠️ Erros comuns
Status	Motivo	Solução
400	Parâmetro obrigatório ausente	Envie o parâmetro correto
404	Anime/episódio não encontrado	Revise o ID ou nome enviado
500	Erro interno / timeout	Tente novamente mais tarde

🧑‍💻 Desenvolvedor
<p> <img src="https://i.ibb.co/6RgzrZ7d/baixados.jpg" width="48" style="border-radius: 50%; vertical-align: middle; margin-right: 10px;" /> <strong>Lopes</strong> · <code>@dvhackzz</code> </p>
Discord: clique aqui

Base da API: vercel.app
