import PersonModel from "@/components/Model/PersonModel";
import Image from "next/image";
import CarModel from "@/components/Model/CarModel";
import AccordionsSection from "@/components/Index/AccordionsSection";
import { ExternalLinkIcon } from "@/components/ui/icons/oi-external-link";
import AudioPlayer from "@/components/Index/AudioPlayer";

export default function Home() {
  return (
    <div>
      {/* Sekcja HERO – przyklejona do góry */}
      <div className="w-full h-screen sticky top-0 z-0 bg-radial-[at_25%_25%] from-zinc-800 to-zinc-900 to-75%">
        <div className="w-full h-full absolute top-0 left-0">
          <CarModel
            modelPath="/models/trueno.glb"
            auto={true}
            fov={5}
            reactToMouse={true}
          />
        </div>

        <div className="w-full h-full absolute top-0 left-0 flex flex-col items-center">
          <div className="w-60 aspect-video relative">
            <Image
              src="/images/chandra-white.png"
              alt="Chandra logo białe"
              fill={true}
              className="object-contain"
            />
          </div>

          <h1 className="flex gap-2 hover:underline cursor-pointer pl-7 tracking-wide">chandra.movement <ExternalLinkIcon size={38} strokeWidth={0.5}/></h1>
        </div>

        <div className="w-20 aspect-square absolute bottom-10 left-1/2 -translate-x-1/2">
          <Image
            src="/images/scroll-down-mouse.webp"
            alt="Przesuń w dół"
            fill={true}
            className="object-contain"
          />
        </div>

        <AudioPlayer />
      </div>

      {/* Sekcja niżej – przykrywa HERO */}
      <div className="w-full h-screen relative z-10 bg-foreground border text-background">
        <div className="w-full max-w-7xl mx-auto p-8 max-md:p-4">
          <div>
            <h1 className="text-xl font-bold">Najnowsza kolekcja</h1>
          </div>
          <div>
            <h1 className="text-xl font-bold">Archiwum kolekcji</h1>
          </div>
        </div>
        
        <AccordionsSection />
      </div>
    </div>
  );
}
