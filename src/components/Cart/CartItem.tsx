"use client"

import Image from "next/image";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCart();
  const mainImage = item.product.images[0] ? `/api/images/${item.product.images[0].id}` : "/images/placeholder.png";

  return (
    <div className="flex gap-4 py-4 border-b border-zinc-800">
      <div className="relative w-20 h-20 bg-zinc-900 rounded-md overflow-hidden flex-shrink-0 border border-zinc-800">
        <Image
          src={mainImage}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-zinc-100 text-sm uppercase tracking-wide">{item.product.name}</h4>
            {item.size && <p className="text-xs text-zinc-500 mt-1">Rozmiar: {item.size}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-zinc-500 hover:text-red-500 hover:bg-transparent"
            onClick={() => removeItem(item.product.id, item.size)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-xs text-zinc-400">Ilość: {item.quantity}</p>
          <p className="font-mono text-sm text-zinc-200">{(item.product.price * item.quantity).toFixed(2)} PLN</p>
        </div>
      </div>
    </div>
  );
}
