import { CardContent } from "@/components/ui/card";
import { Subtitle, Title } from "../components/ui/Title";
import {
  MusicalNoteIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  PlayIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Home = () => {
  return (
    <div className="flex w-full flex-col items-center flex-grow">
      <div className="w-[65px] h-[50px] bg-[#ff0055] rounded-[10px] flex items-center justify-center mb-[20px]">
        <PlayIcon className="w-[40px] h-[40px] text-white" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <Title className="text-white">YouTube Downloader</Title>
        <Subtitle className="text-[#7d838e] text-[20px]">
          Baixe músicas e vídeos de forma simples
        </Subtitle>
      </div>

      <div className="flex gap-10 mt-[25px]">
        <CardContent className="bg-[#202237] w-[430px] min-h-[325px] rounded-[15px] p-[20px] border border-[#7d838e] flex flex-col justify-center gap-4">
          <div className="flex gap-3">
            <div className="w-[50px] h-[50px] bg-[#c1356e] rounded-[15px] flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <Subtitle className="text-white text-[23px] mb-[-15px]">
                Baixar MP3
              </Subtitle>
              <Subtitle className="text-[#7d838e] text-[15px]">
                Extraia apenas o áudio
              </Subtitle>
            </div>
          </div>
          <InputWithIcon
            icon={<ClipboardDocumentIcon className="h-5 w-5 text-white" />}
            iconPosition="right"
            className="border-[#7d838e] h-[55px] bg-[#181826] pl-4"
            placeholder="Cole o link do YouTuibe aqui..."
          />
           <div className="mt-2">
            <p className="text-[#7d838e] text-sm mb-2">
              Selecione a qualidade:
            </p>
            <RadioGroup defaultValue="128" className="flex gap-6">
                <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="128"
                  id="q1"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="q1" className="text-white">
                  128 kbps
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="192"
                  id="q2"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="q2" className="text-white">
                  192 kbps
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="320"
                  id="q3"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="q3" className="text-white">
                 320 kbps
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button className="w-[390px] h-[55px] bg-[#c1356e] hover:bg-[#a02d5c] transition-colors duration-200 flex items-center justify-center">
            <ArrowDownTrayIcon className="text-white" />
            <p className="text-[20px]">Baixar MP3</p>
          </Button>
        </CardContent>
        <CardContent className="bg-[#202237] w-[430px] min-h-[285px] rounded-[15px] p-[20px] border border-[#7d838e] flex flex-col justify-center gap-4">
          <div className="flex gap-3">
            <div className="w-[50px] h-[50px] bg-[#0da1d9] rounded-[15px] flex items-center justify-center">
              <VideoCameraIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <Subtitle className="text-white text-[23px] mb-[-15px]">
                Baixar Vídeo
              </Subtitle>
              <Subtitle className="text-[#7d838e] text-[15px]">
                Vídeo completo com áudio
              </Subtitle>
            </div>
          </div>
          <InputWithIcon
            icon={<ClipboardDocumentIcon className="h-5 w-5 text-white" />}
            iconPosition="right"
            className="border-[#7d838e] h-[55px] bg-[#181826] pl-4"
            placeholder="Cole o link do YouTuibe aqui..."
          />
          <div className="mt-2">
            <p className="text-[#7d838e] text-sm mb-2">
              Selecione a qualidade:
            </p>
            <RadioGroup defaultValue="480p" className="flex gap-6">
                <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="480p"
                  id="r1"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="r1" className="text-white">
                  480p
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="720p"
                  id="r2"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="r2" className="text-white">
                  720p
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="1080p"
                  id="r3"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="r3" className="text-white">
                  1080p
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="4k"
                  id="r4"
                  className="border-[#7d838e] text-[#c1356e]"
                />
                <Label htmlFor="r4" className="text-white">
                  4K
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button className="w-[390px] h-[55px] bg-[#00acff] hover:bg-[#057fb7] transition-colors duration-200 flex items-center justify-center">
            <ArrowDownTrayIcon className="text-white" />
            <p className="text-[20px]">Baixar Vídeo</p>
          </Button>
        </CardContent>
      </div>
    </div>
  );
};

export default Home;
