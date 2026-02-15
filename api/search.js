const axios = require("axios");
const cheerio = require("cheerio");

// Função para buscar gêneros de um anime
async function getGenerosDoAnime(slug) {
  try {
    const url = `https://goyabu.io/anime/${slug}`;
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    const generos = [];

    $('.filter-btn[href*="generos"]').each((i, el) => {
      const genero = $(el).text().trim();
      if (genero) generos.push(genero);
    });

    return generos;
  } catch (error) {
    return [];
  }
}

module.exports = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: "keyword vazio"
      });
    }

    // Slug base (formata o nome para URL)
    const baseSlug = keyword.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Lista de slugs possíveis
    const slugsParaTestar = [
      baseSlug,
      `${baseSlug}-2`,
      `${baseSlug}-3`,
      `${baseSlug}-4`,
      `${baseSlug}-5`,
      `${baseSlug}-dublado`,
      `${baseSlug}-legendado`,
      `${baseSlug}-filme`,
      `${baseSlug}-serie`,
      `${baseSlug}-temporada-1`,
      `${baseSlug}-temporada-2`,
      `${baseSlug}-temporada-3`,
      `${baseSlug}-temporada-4`,
      `${baseSlug}-parte-1`,
      `${baseSlug}-parte-2`,
      `${baseSlug}-i`,
      `${baseSlug}-ii`,
      `${baseSlug}-iii`,
      `${baseSlug}-iv`,
      `${baseSlug}-v`,
      `${baseSlug}-vi`
    ];

    const resultados = [];
    const slugsTestados = new Set();

    for (const slug of slugsParaTestar) {
      if (slugsTestados.has(slug)) continue;
      slugsTestados.add(slug);

      try {
        const testUrl = `https://goyabu.io/anime/${slug}`;
        const testResponse = await axios.get(testUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 3000,
          validateStatus: () => true
        });

        if (testResponse.status === 200 && !testResponse.data.includes('404') && !testResponse.data.includes('não encontrada')) {
          
          const $ = cheerio.load(testResponse.data);
          const generos = [];
          
          $('.filter-btn[href*="generos"]').each((i, el) => {
            const genero = $(el).text().trim();
            if (genero) generos.push(genero);
          });
          
          const titulo = $('h1.text-hidden').first().text().trim() || slug;
          const thumb = $('meta[property="og:image"]').attr('content') || null;
          
          // Tenta extrair ID
          let id = null;
          const scripts = $('script').map((i, el) => $(el).html()).get();
          for (const script of scripts) {
            if (script && script.includes('post_id')) {
              const match = script.match(/post_id[=:]\s*(\d+)/);
              if (match) {
                id = match[1];
                break;
              }
            }
          }
          
          resultados.push({
            id: id || slug.match(/\d+$/)?.[0] || null,
            slug,
            titulo,
            thumb,
            url: testUrl,
            generos: generos.length ? generos : ["Não informado"]
          });
        }
      } catch {
        // Ignora erros
      }

      // Delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Remove duplicatas
    const unicos = [];
    const titulosVistos = new Set();
    
    for (const anime of resultados) {
      const tituloLower = anime.titulo.toLowerCase();
      if (!titulosVistos.has(tituloLower)) {
        titulosVistos.add(tituloLower);
        unicos.push(anime);
      }
    }

    res.setHeader("Content-Type", "application/json");
    
    if (unicos.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(unicos);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: String(err?.message || err)
    });
  }
};
