import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/Index/ProductCard";
import Link from "next/link";
import CartTrigger from "@/components/Cart/CartTrigger";
import { ArrowLeft } from "lucide-react";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionId = parseInt(id);

  if (isNaN(collectionId)) {
    notFound();
  }

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
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
          isActive: true,
          createdAt: true,
          updatedAt: true,
          collectionId: true,
          images: { select: { id: true } },
          sizes: true,
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black">
      <CartTrigger />
      
      {/* Header Section */}
      <div className="relative w-full bg-zinc-900/50 border-b border-zinc-800 pt-24 pb-12 px-4 md:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-mono">Strona główna</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 border border-zinc-700 rounded-full text-xs font-mono text-zinc-400 uppercase tracking-wider">
                {new Date(collection.releaseDate).toLocaleDateString()}
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                {collection.name}
              </h1>
              <p className="max-w-2xl text-zinc-400 text-lg leading-relaxed border-l-2 border-zinc-800 pl-4">
                {collection.description}
              </p>
            </div>
            
            {/* Decorative ID */}
            <div className="hidden md:block">
                <span className="text-9xl font-black text-zinc-900 select-none pointer-events-none">
                    {String(collection.id).padStart(2, '0')}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {collection.products.length === 0 && (
            <div className="w-full py-24 text-center border border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 font-mono uppercase tracking-widest">Brak produktów w tej kolekcji</p>
            </div>
        )}
      </div>
      
      {/* Footer-like element */}
      <div className="w-full py-12 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
            chandra.movement / kolekcja {String(collection.id).padStart(3, '0')}
        </p>
      </div>
    </div>
  );
}
