import Image from "next/image";
import Link from "next/link";
import { Product } from "@/generated/client/client";

interface ProductCardProps {
  product: Product & { images: { id: number }[] };
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] ? `/api/images/${product.images[0].id}` : "/images/placeholder.png";

  return (
    <Link href={`/products/${product.id}`} className="group block relative">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
        {/* Liquid Glass Effect Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Image */}
        <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
           {/* Assuming images are stored locally or external URL. If local, ensure they start with / */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>

        {/* Tribal/Designer Elements */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12">
          <h3 className="font-bold text-lg tracking-widest uppercase text-white drop-shadow-md transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            {product.name}
          </h3>
          <p className="text-zinc-300 font-mono text-sm mt-1 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {product.price.toFixed(2)} PLN
          </p>
        </div>
        
        {/* Decorative corner */}
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/50 opacity-50" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/50 opacity-50" />
      </div>
    </Link>
  );
}
