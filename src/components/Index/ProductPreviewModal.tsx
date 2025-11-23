"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/generated/client/client";
import Product3DModel from "@/components/Model/Product3DModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface ProductPreviewModalProps {
  product: Product & { images: { id: number }[] };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductPreviewModal({ product, isOpen, onClose }: ProductPreviewModalProps) {
  // Determine if we have a model.
  // We check if modelUrl is provided OR if modelData is present (not null).
  const hasModel = !!product.modelUrl || (product.modelData !== null && product.modelData !== undefined);

  const modelUrl = product.modelUrl || (hasModel ? `/api/models/${product.id}` : null);
  
  // State to track if we should show the 3D model or the main image
  // If we have a model, we default to it.
  const [showModel, setShowModel] = useState(!!modelUrl);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(product.images[0]?.id || null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl bg-zinc-950 border-zinc-800 text-zinc-100 h-[90vh] overflow-y-auto md:h-auto p-0 gap-0 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Visuals */}
        <div className="w-full md:w-1/2 bg-black/20 p-6 flex flex-col gap-4">
          <div className="aspect-square relative rounded-xl overflow-hidden border border-zinc-800 bg-black/40">
            {showModel && modelUrl ? (
               <Product3DModel modelUrl={modelUrl} />
            ) : (
               selectedImageId ? (
                 <Image 
                   src={`/api/images/${selectedImageId}`} 
                   alt={product.name} 
                   fill 
                   className="object-cover" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-500">Brak zdjęcia</div>
               )
            )}
          </div>
          
          {/* Thumbnails / Toggles */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {/* Button to switch to 3D Model */}
            {modelUrl && (
              <button 
                onClick={() => setShowModel(true)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${showModel ? 'border-white' : 'border-zinc-800'} bg-zinc-900 flex items-center justify-center transition-colors`}
              >
                <span className="text-xs font-bold text-zinc-400">3D</span>
              </button>
            )}

            {product.images.map((img) => (
              <button 
                key={img.id} 
                onClick={() => {
                  setShowModel(false);
                  setSelectedImageId(img.id);
                }}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${!showModel && selectedImageId === img.id ? 'border-white' : 'border-zinc-800'} transition-colors`}
              >
                <Image src={`/api/images/${img.id}`} alt={product.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="mb-6">
            <DialogTitle className="text-3xl font-bold tracking-wider uppercase text-white">{product.name}</DialogTitle>
            <p className="text-2xl text-zinc-400 mt-2 font-mono">{product.price.toFixed(2)} PLN</p>
          </div>

          <div className="space-y-6 text-zinc-300 flex-grow">
            <div>
              <h4 className="font-semibold text-zinc-100 mb-2 uppercase tracking-wide text-sm">Opis Produktu</h4>
              <p className="text-sm leading-relaxed text-zinc-400">{product.description}</p>
            </div>
            
            {product.composition && (
              <div>
                <h4 className="font-semibold text-zinc-100 mb-2 uppercase tracking-wide text-sm">Skład</h4>
                <p className="text-sm text-zinc-400">{product.composition}</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wide h-12 text-lg" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              DODAJ DO KOSZYKA
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
