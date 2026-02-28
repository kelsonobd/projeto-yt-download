import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);
const DOWNLOADS_DIR = path.join(__dirname, '../../downloads');

// ✅ ALTERADO: Agora usa o yt-dlp do sistema (que já instalamos com apt)
const YT_DLP_PATH = 'yt-dlp';

// Garantir que a pasta de downloads existe
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

export const downloadVideo = async (req: Request, res: Response) => {
  const { url, quality = '128', type = 'audio' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    const timestamp = Date.now();
    const outputTemplate = path.join(DOWNLOADS_DIR, `%(title)s_${timestamp}.%(ext)s`);
    
    let command: string;
    
    if (type === 'audio') {
      const qualityMap: Record<string, string> = {
        '128': '128K',
        '192': '192K',
        '320': '320K'
      };
      const audioQuality = qualityMap[quality] || '128K';
      command = `${YT_DLP_PATH} --impersonate chrome -x --audio-format mp3 --audio-quality ${audioQuality} -o "${outputTemplate}" "${url}"`;
    } else {
      const formatMap: Record<string, string> = {
        '360': 'best[height<=360]',
        '720': 'best[height<=720]',
        '1080': 'best[height<=1080]',
        '4k': 'best[height<=2160]'
      };
      const format = formatMap[quality] || 'best[height<=720]';
      command = `${YT_DLP_PATH} --impersonate chrome -f "${format}" --merge-output-format mp4 -o "${outputTemplate}" "${url}"`;
    }

    console.log('📥 Executando comando:', command);
    
    const { stderr } = await execAsync(command);
    
    if (stderr) console.error('⚠️ yt-dlp stderr:', stderr);

    // Aguarda um momento para o arquivo ser escrito
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Procura o arquivo baixado
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const extension = type === 'audio' ? '.mp3' : '.mp4';
    
    const downloadedFile = files
      .map(f => path.join(DOWNLOADS_DIR, f))
      .find(f => f.includes(timestamp.toString()) && f.endsWith(extension));

    if (downloadedFile && fs.existsSync(downloadedFile)) {
      const rawFilename = path.basename(downloadedFile);
      const videoTitle = rawFilename.replace(`_${timestamp}`, '').replace(/\.[^/.]+$/, '');
      const finalFilename = `${videoTitle}${extension}`;
      
      const fileBuffer = fs.readFileSync(downloadedFile);
      const encodedFilename = encodeURIComponent(finalFilename).replace(/['()]/g, escape);
      
      // Envia o arquivo
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
        'Content-Type': type === 'audio' ? 'audio/mpeg' : 'video/mp4',
        'Content-Length': fileBuffer.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Expose-Headers': 'Content-Disposition'
      });
      
      res.end(fileBuffer);
      
      // Remove o arquivo após 5 minutos
      setTimeout(() => {
        if (fs.existsSync(downloadedFile)) {
          fs.unlink(downloadedFile, () => {});
        }
      }, 5 * 60 * 1000);
      
    } else {
      res.status(500).json({ error: 'Arquivo não encontrado após download' });
    }

  } catch (error) {
    console.error('❌ Erro no download:', error);
    res.status(500).json({ 
      error: 'Falha ao processar download',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
};