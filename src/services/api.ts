const API_URL = 'http://localhost:3001/api';

export const downloadAPI = {
  downloadVideo(videoUrl: string, type: 'audio' | 'video' = 'audio', quality?: string) {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${API_URL}/download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: videoUrl, type, quality }),
          signal
        });
        
        if (!response.ok) {
          const error = await response.json();
          reject(new Error(error.error || 'Erro no download'));
          return;
        }
        
        // Extrair o nome do arquivo do header Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `download.${type === 'audio' ? 'mp3' : 'mp4'}`;
        
        if (contentDisposition) {
          const utf8Match = contentDisposition.match(/filename\*?=UTF-8''([^;]+)/);
          if (utf8Match && utf8Match[1]) {
            filename = decodeURIComponent(utf8Match[1]);
          } else {
            const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
        
        resolve({ success: true, filename });
        
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          reject(new Error('Download cancelado'));
        } else {
          console.error('❌ Erro no download:', error);
          reject(error);
        }
      }
    });
    
    return {
      promise,
      cancel: () => controller.abort()
    };
  },

  async healthCheck() {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  }
};