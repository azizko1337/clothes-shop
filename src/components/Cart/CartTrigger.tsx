"use client"

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function CartTrigger() {
  const { openCart, items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 text-white hover:bg-white/10 hover:text-white"
      onClick={openCart}
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </div>
    </Button>
  );
}
