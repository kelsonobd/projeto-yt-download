import { useState, useRef } from 'react';
import { CardContent } from "@/components/ui/card";
import { Subtitle, Title } from "../components/ui/Title";
import {
  MusicalNoteIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  PlayIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { downloadAPI } from '@/services/api';

const Home = () => {
  const [url, setUrl] = useState('');
  const [downloadType, setDownloadType] = useState<'audio' | 'video'>('audio');
  const [audioQuality, setAudioQuality] = useState('128');
  const [videoQuality, setVideoQuality] = useState('720p');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  
  // Ref para armazenar a função de cancelar
  const cancelDownloadRef = useRef<(() => void) | null>(null);

  // 🔥 FUNÇÃO CORRIGIDA - Agora limpa o input ao trocar de tipo
  const handleTypeChange = (newType: 'audio' | 'video') => {
    setDownloadType(newType);
    setUrl('');          // 🔥 Limpa o input
    setError('');        // Limpa erro
    setSuccess(false);   // Limpa sucesso
    setCancelled(false); // Limpa cancelamento
  };

  const handleDownload = async () => {
    if (!url) {
      setError('Por favor, insira uma URL');
      return;
    }

    setLoading(true);
    setDownloading(true);
    setError('');
    setSuccess(false);
    setCancelled(false);
    setProgress(0);

    // Simular progresso enquanto o download acontece
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // Mapear qualidade para o formato esperado pelo backend
      const quality = downloadType === 'audio' 
        ? audioQuality 
        : videoQuality.replace('p', '');

      console.log('🚀 Iniciando download:', { url, downloadType, quality });
      
      // Usar a nova API que retorna controle de cancelamento
      const { promise, cancel } = downloadAPI.downloadVideo(url, downloadType, quality);
      
      // Salvar a função de cancelar na ref
      cancelDownloadRef.current = cancel;
      
      // Aguardar o download
      await promise;
      
      // Limpar a ref após concluir
      cancelDownloadRef.current = null;
      
      // Limpar o intervalo e completar progresso
      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      
      console.log('✅ Download concluído!');
      setUrl('');
      
      // Mostrar mensagem de sucesso por 3 segundos
      setTimeout(() => {
        setSuccess(false);
        setDownloading(false);
        setProgress(0);
      }, 3000);
      
    } catch (err) {
      // Limpar o intervalo em caso de erro
      clearInterval(progressInterval);
      
      // Verificar se foi cancelado
      if (err instanceof Error && err.message === 'Download cancelado') {
        setCancelled(true);
        setError('Download cancelado pelo usuário');
        
        // Limpar mensagem de cancelamento após 3 segundos
        setTimeout(() => {
          setCancelled(false);
          setError('');
          setDownloading(false);
          setProgress(0);
        }, 3000);
      } else {
        console.error('❌ Erro no download:', err);
        setError(err instanceof Error ? err.message : 'Erro ao fazer download');
        setDownloading(false);
        setProgress(0);
      }
      
      // Limpar a ref
      cancelDownloadRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (cancelDownloadRef.current) {
      console.log('🛑 Cancelando download...');
      cancelDownloadRef.current(); // Chama a função de cancelar
      cancelDownloadRef.current = null;
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
      
      // Feedback visual
      const input = document.querySelector('input');
      input?.classList.add('border-green-500');
      setTimeout(() => {
        input?.classList.remove('border-green-500');
      }, 500);
      
    } catch (err) {
      console.error('Erro ao colar:', err);
      alert('Não foi possível colar. Verifique as permissões.');
    }
  };
  
  return (
    <div className="flex w-full flex-col items-center flex-grow px-4">
      <div className="w-[65px] h-[50px] bg-[#ff0055] rounded-[10px] flex items-center justify-center mb-[20px]">
        <PlayIcon className="w-[40px] h-[40px] text-white" />
      </div>
      
      <div className="flex flex-col items-center gap-3 mb-8">
        <Title className="text-white">YouTube Downloader</Title>
        <Subtitle className="text-[#7d838e] text-[20px]">
          Baixe músicas e vídeos de forma simples
        </Subtitle>
      </div>

      {/* Seletor de tipo de download */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={downloadType === 'audio' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('audio')}
          className={downloadType === 'audio' 
            ? 'bg-[#c1356e] hover:bg-[#a02d5c]' 
            : 'bg-[#202237] border-[#7d838e] text-white hover:bg-[#2a2c3f]'
          }
          disabled={downloading}
        >
          <MusicalNoteIcon className="h-5 w-5 mr-2" />
          Áudio MP3
        </Button>
        <Button
          variant={downloadType === 'video' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('video')}
          className={downloadType === 'video' 
            ? 'bg-[#00acff] hover:bg-[#057fb7]' 
            : 'bg-[#202237] border-[#7d838e] text-white hover:bg-[#2a2c3f]'
          }
          disabled={downloading}
        >
          <VideoCameraIcon className="h-5 w-5 mr-2" />
          Vídeo MP4
        </Button>
      </div>

      {/* Card unificado */}
      <CardContent className="bg-[#202237] w-[430px] rounded-[15px] p-[20px] border border-[#7d838e] flex flex-col gap-4">
        <div className="flex gap-3">
          <div className={`w-[50px] h-[50px] rounded-[15px] flex items-center justify-center ${
            downloadType === 'audio' ? 'bg-[#c1356e]' : 'bg-[#00acff]'
          }`}>
            {downloadType === 'audio' 
              ? <MusicalNoteIcon className="h-8 w-8 text-white" />
              : <VideoCameraIcon className="h-8 w-8 text-white" />
            }
          </div>
          <div className="flex flex-col">
            <Subtitle className="text-white text-[23px] mb-[-15px]">
              Baixar {downloadType === 'audio' ? 'MP3' : 'Vídeo'}
            </Subtitle>
            <Subtitle className="text-[#7d838e] text-[15px]">
              {downloadType === 'audio' 
                ? 'Extraia apenas o áudio' 
                : 'Vídeo completo com áudio'
              }
            </Subtitle>
          </div>
        </div>

        <InputWithIcon
          icon={<ClipboardDocumentIcon className="h-5 w-5 text-white cursor-pointer hover:text-gray-300" />}
          iconPosition="right"
          className="border-[#7d838e] h-[55px] bg-[#181826] pl-4 text-white"
          placeholder="Cole o link do YouTube aqui..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onIconClick={handlePaste}
          disabled={downloading}
        />

        {error && !cancelled && (
          <div className="bg-red-500/10 border border-red-500 rounded-md p-3 mt-1">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {cancelled && (
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-md p-3 mt-1 flex items-center gap-2">
            <XCircleIcon className="h-5 w-5 text-yellow-500" />
            <p className="text-yellow-500 text-sm">
              Download cancelado
            </p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 rounded-md p-3 mt-1 flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <p className="text-green-500 text-sm">
              Download concluído! Escolha onde salvar o arquivo.
            </p>
          </div>
        )}

        <div className="mt-2">
          <p className="text-[#7d838e] text-sm mb-2">
            Selecione a qualidade:
          </p>
          
          {downloadType === 'audio' ? (
            <RadioGroup value={audioQuality} onValueChange={setAudioQuality} className="flex gap-6">
              {['128', '192', '320'].map((quality) => (
                <div key={quality} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={quality}
                    id={`audio-${quality}`}
                    className="border-[#7d838e] text-[#c1356e]"
                    disabled={downloading}
                  />
                  <Label htmlFor={`audio-${quality}`} className="text-white">
                    {quality} kbps
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <RadioGroup value={videoQuality} onValueChange={setVideoQuality} className="flex flex-wrap gap-4">
              {['480p', '720p', '1080p', '4k'].map((quality) => (
                <div key={quality} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={quality}
                    id={`video-${quality}`}
                    className="border-[#7d838e] text-[#00acff]"
                    disabled={downloading}
                  />
                  <Label htmlFor={`video-${quality}`} className="text-white">
                    {quality}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        {/* Barra de Progresso */}
        {downloading && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-[#7d838e] text-sm text-center">
              {progress < 100 ? 'Preparando download...' : 'Processando...'}
            </p>
          </div>
        )}

        {/* Botão que muda durante o download */}
        {downloading ? (
          <Button 
            variant="destructive"
            className="w-full h-[55px] flex items-center justify-center bg-red-500 hover:bg-red-700 transition-colors duration-200"
            onClick={handleCancel}
          >
            <XCircleIcon className="text-white mr-2 h-5 w-5" />
            <p className="text-[20px]">Cancelar Download</p>
          </Button>
        ) : (
          <Button 
            className={`w-full h-[55px] flex items-center justify-center transition-colors duration-200 ${
              downloadType === 'audio' 
                ? 'bg-[#c1356e] hover:bg-[#a02d5c]' 
                : 'bg-[#00acff] hover:bg-[#057fb7]'
            }`}
            onClick={handleDownload}
            disabled={loading}
          >
            <ArrowDownTrayIcon className="text-white mr-2" />
            <p className="text-[20px]">
              Baixar {downloadType === 'audio' ? 'MP3' : 'Vídeo'}
            </p>
          </Button>
        )}
      </CardContent>
    </div>
  );
};

export default Home;