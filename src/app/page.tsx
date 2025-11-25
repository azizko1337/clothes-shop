import PersonModel from "@/components/Model/PersonModel";
import Image from "next/image";
import CarModel from "@/components/Model/CarModel";
import AccordionsSection from "@/components/Index/AccordionsSection";
import { ExternalLinkIcon } from "@/components/ui/icons/oi-external-link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/Index/ProductCard";
import CollectionCard from "@/components/Index/CollectionCard";
import ScrollDownButton from "@/components/Index/ScrollDownButton";
import Link from "next/link";

export default async function Home() {
  const latestCollection = await prisma.collection.findFirst({
    orderBy: { releaseDate: 'desc' },
    include: { 
      products: { 
        select: {
          id: true,
          name: true,
          description: true,
          composition: true,
          price: true,
          modelUrl: true,
          modelMimeType: true,
          glbAttribution: true,
          glbLink: true,
          createdAt: true,
          updatedAt: true,
          collectionId: true,
          images: { select: { id: true } },
          sizes: true
        }
      } 
    }
  });

  const otherCollections = await prisma.collection.findMany({
    where: { id: { not: latestCollection?.id } },
    orderBy: { releaseDate: 'desc' },
    include: { 
      products: { 
        take: 1, 
        select: {
          id: true,
          name: true,
          description: true,
          composition: true,
          price: true,
          modelUrl: true,
          modelMimeType: true,
          glbAttribution: true,
          glbLink: true,
          createdAt: true,
          updatedAt: true,
          collectionId: true,
          images: { select: { id: true } },
          sizes: true
        }
      } 
    }
  });

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

          <Link href="https://www.instagram.com/chandra.movement/" 
              className="flex gap-2 hover:underline cursor-pointer tracking-wide"
              target="_blank"
              >chandra.movement</Link>
        </div>

        <ScrollDownButton />

        {/* 3D Model Credits */}
        <div className="absolute bottom-6 right-6 z-20 text-right font-mono text-[10px] tracking-widest text-zinc-500">
          <div className="flex flex-col items-end gap-0.5 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <span className="uppercase text-zinc-600">Model 3D</span>
            <a 
              href="https://sketchfab.com/3d-models/toyota-trueno-ae86-initial-d-40c0a445f8fa42568c7ecf208b6d97bd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              Toyota AE86 Trueno autorstwa Flamestroke
            </a>
            <span className="text-zinc-600">Licencja: CC Attribution</span>
          </div>
        </div>
      </div>

      {/* Sekcja niżej – przykrywa HERO */}
      <div className="w-full min-h-screen relative z-10 bg-zinc-950 text-zinc-100">
        <div className="w-full max-w-7xl mx-auto p-8 max-md:p-4 space-y-24 pb-24">
          
          {/* Latest Collection Section */}
          {latestCollection && (
            <section>
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">NAJNOWSZY DROP</h2>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                    {latestCollection.name}
                  </h1>
                </div>
                <div className="mt-4 md:mt-0 md:text-right max-w-md">
                   <p className="text-zinc-400 text-sm font-mono leading-relaxed border-l-2 border-zinc-800 pl-4 md:border-l-0 md:border-r-2 md:pr-4 md:pl-0">
                     {latestCollection.description}
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestCollection.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Archive Section */}
          {otherCollections.length > 0 && (
            <section>
               <div className="mb-10 border-b border-zinc-800 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-1">Historia</h2>
                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-zinc-300">
                      Archiwum kolekcji
                    </h1>
                  </div>
                  <div className="hidden md:block">
                    <ExternalLinkIcon className="w-8 h-8 text-zinc-700" />
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {otherCollections.map((collection) => (
                   <CollectionCard key={collection.id} collection={collection} />
                 ))}
               </div>
            </section>
          )}
        </div>
        
        <AccordionsSection />
      </div>
    </div>
  );
}
