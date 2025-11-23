import Link from "next/link";
import { Collection, Product } from "@/generated/client/client";
import Image from "next/image";

interface CollectionCardProps {
  collection: Collection & { products: (Product & { images: { id: number }[] })[] };
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  // Get a preview image from the first product in the collection
  const previewImage = collection.products[0]?.images[0] ? `/api/images/${collection.products[0].images[0].id}` : "/images/placeholder.png";

  return (
    <Link href={`/collections/${collection.id}`} className="group block w-full">
      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-900">
        <div className="absolute inset-0 flex items-center justify-between p-6 z-10">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
              {new Date(collection.releaseDate).toLocaleDateString()}
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
              {collection.name}
            </h3>
          </div>
          
          {/* Tribal arrow or icon */}
          <div className="text-zinc-600 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Background Image with heavy blur/overlay */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
             <Image
                src={previewImage}
                alt={collection.name}
                fill
                className="object-cover grayscale mix-blend-overlay"
              />
        </div>
        
        {/* Liquid effect */}
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
      </div>
    </Link>
  );
}
