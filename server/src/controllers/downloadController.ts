import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);
const DOWNLOADS_DIR = path.join(__dirname, '../../downloads');

// Garantir que a pasta existe
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
      command = `yt-dlp -x --audio-format mp3 --audio-quality ${audioQuality} -o "${outputTemplate}" "${url}"`;
    } else {
      const formatMap: Record<string, string> = {
        '360': 'best[height<=360]',
        '720': 'best[height<=720]',
        '1080': 'best[height<=1080]',
        '4k': 'best[height<=2160]'
      };
      const format = formatMap[quality] || 'best[height<=720]';
      command = `yt-dlp -f "${format}" --merge-output-format mp4 -o "${outputTemplate}" "${url}"`;
    }

    console.log('🎬 Executando:', command);
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) console.error('⚠️ stderr:', stderr);

    const files = fs.readdirSync(DOWNLOADS_DIR);
    const extension = type === 'audio' ? '.mp3' : '.mp4';
    
    const downloadedFile = files
      .map(f => path.join(DOWNLOADS_DIR, f))
      .find(f => f.includes(timestamp.toString()) && f.endsWith(extension));

    if (downloadedFile && fs.existsSync(downloadedFile)) {
      const title = path.basename(downloadedFile).replace(`_${timestamp}`, '');
      
      res.download(downloadedFile, title, (err) => {
        if (err) console.error('❌ Erro ao enviar:', err);
        setTimeout(() => {
          fs.unlink(downloadedFile, () => {});
          console.log('🧹 Arquivo removido:', downloadedFile);
        }, 5 * 60 * 1000);
      });
    } else {
      throw new Error('Arquivo não encontrado após download');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ 
      error: 'Falha ao processar download',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
};