import axios from "axios";
import cheerio from "cheerio";

// Função auxiliar pra decodificar URL (já existe, mas vou deixar explícita)
function decryptBloggerUrl(encryptedData) {
  try {
    if (!encryptedData) return null;
    // Decodificar Base64
    const decoded = Buffer.from(encryptedData, "base64").toString("utf8");
    // Inverter a string (engenharia reversa do PHP)
    return decoded.split("").reverse().join("");
  } catch (e) {
    console.error("Erro ao decifrar:", e);
    return null;
  }
}

export default async function handler(req, res) {
  // Configurar CORS (opcional, mas útil)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const episodeId = String(req.query.episode_id || "").trim();
    
    // Validar entrada
    if (!episodeId) {
      return res.status(400).json({ 
        success: false, 
        error: "episode_id é obrigatório" 
      });
    }

    // Validar se é numérico (IDs do goyabu são números)
    if (!/^\d+$/.test(episodeId)) {
      return res.status(400).json({ 
        success: false, 
        error: "episode_id deve ser numérico" 
      });
    }

    const pageUrl = `https://goyabu.io/${episodeId}`;
    console.log(`🔍 Buscando: ${pageUrl}`);

    const { data } = await axios.get(pageUrl, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      },
      timeout: 10000 // Timeout de 10 segundos
    });

    const $ = cheerio.load(data);
    
    // ---------- LÓGICA PRINCIPAL ----------
    let videoUrl = null;
    let source = null;

    // 1. TENTAR PLAYER 2 (IFRAME) - PRIORIDADE MÁXIMA
    const encrypted = $('.player-tab[data-player-type="iframe"]').attr("data-blogger-url-encrypted");
    
    if (encrypted) {
      videoUrl = decryptBloggerUrl(encrypted);
      source = "player2";
      console.log("✅ Player 2 encontrado!");
    }

    // 2. FALLBACK: TENTAR PLAYER 1 (BLOGGER ORIGINAL)
    if (!videoUrl) {
      // Procurar no script que contém playersData
      const scripts = $('script').map((i, el) => $(el).html()).get();
      
      for (const script of scripts) {
        if (!script) continue;
        
        // Procurar pelo token do Blogger
        const tokenMatch = script.match(/blogger_token":"([^"]+)"/);
        if (tokenMatch) {
          videoUrl = `https://www.blogger.com/video.g?token=${tokenMatch[1]}`;
          source = "player1_token";
          console.log("✅ Player 1 (token) encontrado!");
          break;
        }
        
        // Procurar pela URL completa
        const urlMatch = script.match(/url":"(https:[^"]+blogger\.com[^"]+)"/);
        if (urlMatch) {
          videoUrl = urlMatch[1].replace(/\\/g, '');
          source = "player1_url";
          console.log("✅ Player 1 (URL) encontrado!");
          break;
        }
      }
    }

    // 3. ÚLTIMO FALLBACK: IFRAME ATUAL
    if (!videoUrl) {
      videoUrl = $('#player iframe').attr('src');
      source = "current_iframe";
      console.log("✅ Iframe atual encontrado!");
    }

    // 4. SE NÃO ENCONTROU NADA
    if (!videoUrl) {
      return res.status(404).json({
        success: false,
        error: "Nenhum player encontrado",
        episode_id: episodeId
      });
    }

    // 5. SUCESSO - RETORNAR O LINK
    return res.status(200).json({
      success: true,
      episode_id: episodeId,
      video_url: videoUrl,
      source: source,
      page_url: pageUrl
    });

  } catch (err) {
    console.error("Erro na API:", err);
    
    // Tratamento de erros específicos
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        success: false, 
        error: "Timeout ao buscar página" 
      });
    }
    
    if (err.response?.status === 404) {
      return res.status(404).json({ 
        success: false, 
        error: "Episódio não encontrado" 
      });
    }
    
    // Erro genérico
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}
