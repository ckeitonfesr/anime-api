const axios = require("axios");
const cheerio = require("cheerio");

async function getTotalPaginas() {
  try {
    const { data } = await axios.get("https://goyabu.io/lancamentos", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    
    let totalPaginas = 1;
    const paginationText = $('.pagination, .wp-pagenavi, .nav-links').text();
    const matches = paginationText.match(/de (\d+)/i) || paginationText.match(/Página (\d+) de (\d+)/i);
    
    if (matches) {
      totalPaginas = parseInt(matches[matches.length - 1]);
    } else {
      let ultimoNumero = 0;
      $('.pagination a, .wp-pagenavi a, .page-numbers').each((i, el) => {
        const texto = $(el).text().trim();
        if (/^\d+$/.test(texto)) {
          const num = parseInt(texto);
          if (num > ultimoNumero) ultimoNumero = num;
        }
      });
      totalPaginas = ultimoNumero || 1571;
    }
    
    return totalPaginas;
  } catch {
    return 1571;
  }
}

module.exports = async (req, res) => {
  
  const { pagina = 1, limite = 30 } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    if (!global.totalPaginas) {
      global.totalPaginas = await getTotalPaginas();
    }
    
    const url = pagina == 1 
      ? "https://goyabu.io/lancamentos" 
      : `https://goyabu.io/lancamentos/page/${pagina}/`;
    
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 8000
    });

    const $ = cheerio.load(data);
    const episodios = [];
    
    $('.boxEP.grid-view, article.boxEP').each((i, el) => {
      const $el = $(el);
      const link = $el.find('a').first().attr('href') || '';
      const id = link.match(/\/(\d+)\/?$/)?.[1];
      const titulo = $el.find('.title.hidden-text, .title').first().text().trim();
      const ep = $el.find('.ep-type b').first().text().replace('Episódio', '').trim();
      const dublado = $el.find('.audio-box.dublado').length > 0;
      
      const thumbStyle = $el.find('.coverImg').attr('style') || '';
      const thumb = thumbStyle.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || 
                    $el.find('.thumb.contentImg').attr('data-thumb') || '';
      
      const dataPublicacao = $el.find('.timeAgo').first().attr('data-time') || '';
      
      if (id && titulo) {
        episodios.push({
          id,
          titulo,
          link: link.startsWith('http') ? link : `https://goyabu.io${link}`,
          episodio: ep || 'N/A',
          dublado,
          thumb: thumb || null,
          data_publicacao: dataPublicacao || null
        });
      }
    });

    const episodiosLimitados = episodios.slice(0, parseInt(limite));

    return res.status(200).json({
      sucesso: true,
      pagina: parseInt(pagina),
      total_paginas: global.totalPaginas,
      total_disponivel: episodios.length,
      total_retornado: episodiosLimitados.length,
      limite: parseInt(limite),
      dados: episodiosLimitados
    });

  } catch (error) {
    return res.status(200).json({
      sucesso: true,
      pagina: parseInt(pagina),
      total_paginas: global.totalPaginas || 1571,
      total_episodios: 0,
      dados: []
    });
  }
};
