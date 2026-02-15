const axios = require("axios");
const cheerio = require("cheerio");

const SEARCH = "https://goyabu.io/wp-json/animeonline/search/";
const NONCE = "5ecb5079b5";

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

    // Pega também o título correto e a thumb
    const titulo = $('h1.text-hidden').first().text().trim() || slug;
    const thumb = $('meta[property="og:image"]').attr('content') || null;

    return { generos, titulo, thumb };
  } catch (error) {
    return { generos: [], titulo: slug, thumb: null };
  }
}

module.exports = async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim().toLowerCase();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: "keyword vazio"
      });
    }

    console.log(`\n🔍 Buscando: "${keyword}"`);

    // Primeiro tenta a API original (pode funcionar para alguns termos)
    try {
      const url = new URL(SEARCH);
      url.searchParams.set("keyword", keyword);
      url.searchParams.set("nonce", NONCE);

      const apiResponse = await fetch(url.toString(), {
        headers: { Accept: "application/json" }
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data && data.length > 0) {
          // Se a API funcionar, busca os gêneros para cada resultado
          const resultadosComGeneros = [];
          
          for (const item of data) {
            const { generos, titulo, thumb } = await getGenerosDoAnime(item.slug);
            resultadosComGeneros.push({
              id: item.id,
              slug: item.slug,
              titulo: titulo || item.title,
              thumb: thumb || item.thumb,
              url: `https://goyabu.io/anime/${item.slug}`,
              generos: generos.length ? generos : ["Não informado"]
            });
          }
          
          return res.status(200).json(resultadosComGeneros);
        }
      }
    } catch (e) {
      console.log("API principal falhou, usando método alternativo...");
    }

    // Método alternativo: busca por slugs comuns baseados na keyword
    console.log("Usando método de busca por slugs...");
    
    // Gera slugs possíveis baseados na keyword
    const slugsParaTestar = [
      keyword,
      `${keyword}-2`,
      `${keyword}-3`,
      `${keyword}-4`,
      `${keyword}-5`,
      `${keyword}-dublado`,
      `${keyword}-2-dublado`,
      `${keyword}-3-dublado`,
      `${keyword}-4-dublado`,
      `${keyword}-filme`,
      `${keyword}-movie`,
      `${keyword}-legendado`,
      `${keyword}-serie`,
      `${keyword}-temporada-1`,
      `${keyword}-temporada-2`,
      `${keyword}-temporada-3`,
      `${keyword}-temporada-4`,
      `${keyword}-parte-1`,
      `${keyword}-parte-2`,
      `${keyword}-1`,
      `${keyword}-i`,
      `${keyword}-ii`,
      `${keyword}-iii`,
      `${keyword}-iv`,
      `${keyword}-v`,
      `${keyword}-vi`
    ];

    const resultados = [];
    const slugsTestados = new Set();

    for (const slug of slugsParaTestar) {
      if (slugsTestados.has(slug)) continue;
      slugsTestados.add(slug);

      process.stdout.write(`   Testando ${slug}... `);
      
      try {
        const testUrl = `https://goyabu.io/anime/${slug}`;
        const testResponse = await axios.get(testUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          timeout: 3000,
          validateStatus: () => true
        });

        if (testResponse.status === 200 && !testResponse.data.includes('404') && !testResponse.data.includes('não encontrada')) {
          console.log(`✅`);
          
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
        } else {
          console.log(`❌`);
        }
      } catch {
        console.log(`❌`);
      }

      // Delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (resultados.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Nenhum anime encontrado",
        keyword
      });
    }

    // Remove duplicatas baseado no título (mantém o primeiro)
    const unicos = [];
    const titulosVistos = new Set();
    
    for (const anime of resultados) {
      const tituloLower = anime.titulo.toLowerCase();
      if (!titulosVistos.has(tituloLower)) {
        titulosVistos.add(tituloLower);
        unicos.push(anime);
      }
    }

    console.log(`\n✅ Encontrados ${unicos.length} animes`);
    return res.status(200).json(unicos);

  } catch (err) {
    console.error("Erro:", err.message);
    return res.status(500).json({
      success: false,
      error: String(err?.message || err)
    });
  }
};
