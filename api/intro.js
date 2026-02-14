module.exports = async (req, res) => {
  res.status(200).json({
    name: "Anime API - Goyabu",
    description: "API que extrai dados do goyabu.io",
    endpoints: {
      search: {
        route: "/api/search?keyword=nome",
        description: "Busca anime por palavra-chave"
      },
      episodes: {
        route: "/api/episodes?anime_id=ID",
        description: "Lista episódios pelo anime_id"
      },
      episodeVideo: {
        route: "/api/episode-video?episode_id=ID",
        description: "Extrai link direto do vídeo"
      },
      sinopse: {
        route: "/api/sinopse/NOME_DO_ANIME",
        description: "Retorna apenas title e sinopse"
      }
    },
    exampleCalls: {
      search: "/api/search?keyword=overlord",
      episodes: "/api/episodes?anime_id=69624",
      episodeVideo: "/api/episode-video?episode_id=123456",
      sinopse: "/api/sinopse/isekai%20dark%20web"
    },
    status: "online"
  });
};
