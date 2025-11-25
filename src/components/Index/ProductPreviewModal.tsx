"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/generated/client/client";
import Product3DModel from "@/components/Model/Product3DModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductPreviewModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: Omit<Product, 'modelData'> & { modelData?: any; images: { id: number }[]; sizes: { id: number; size: string }[] };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductPreviewModal({ product, isOpen, onClose }: ProductPreviewModalProps) {
  const { addItem } = useCart();
  // Determine if we have a model.
  // We check if modelUrl is provided OR if modelMimeType is present.
  const hasModel = !!product.modelUrl || !!product.modelMimeType;

  const modelUrl = product.modelUrl || (hasModel ? `/api/models/${product.id}` : null);
  
  // State to track if we should show the 3D model or the main image
  // If we have a model, we default to it.
  const [showModel, setShowModel] = useState(!!modelUrl);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(product.images[0]?.id || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addItem(product as any, selectedSize || undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent closeClassName="text-zinc-400 hover:text-white" className="sm:max-w-6xl bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto p-0 gap-0 flex flex-col md:flex-row">
        
        {/* Left Side: Visuals */}
        <div className="w-full md:w-1/2 bg-black/20 p-6 flex flex-col gap-4">
          <div className="aspect-square relative rounded-xl overflow-hidden border border-zinc-800 bg-black/40">
            {showModel && modelUrl ? (
               <>
                 <Product3DModel modelUrl={modelUrl} />
                 {product.glbAttribution && product.glbLink && (
                    <div className="absolute bottom-4 right-4 z-20 text-right font-mono text-[10px] tracking-widest text-zinc-500 pointer-events-none">
                      <div className="flex flex-col items-end gap-0.5 opacity-50 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                        <span className="uppercase text-zinc-600">Model 3D</span>
                        <a 
                          href={product.glbLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-zinc-200 transition-colors"
                        >
                          {product.glbAttribution}
                        </a>
                      </div>
                    </div>
                 )}
               </>
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

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="font-semibold text-zinc-100 mb-2 uppercase tracking-wide text-sm">Rozmiar</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj) => (
                    <button
                      key={sizeObj.id}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      className={`px-4 py-2 border text-sm font-mono transition-all ${
                        selectedSize === sizeObj.size
                          ? "border-white bg-white text-black"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <Button 
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wide h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.isActive || (product.sizes && product.sizes.length > 0 && !selectedSize)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.isActive ? "DODAJ DO KOSZYKA" : "PRODUKT NIEDOSTĘPNY"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
