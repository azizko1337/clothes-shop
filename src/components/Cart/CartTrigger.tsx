"use client"

import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import clsx from "clsx";

export default function CartTrigger() {
  const { openCart, items, isOpen } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      onClick={openCart}
      className={clsx(
        "fixed right-0 top-40 z-[90] p-3 bg-black/80 backdrop-blur-md text-accent rounded-l-xl border-y border-l border-neutral-800 shadow-2xl transition-transform duration-300 hover:bg-neutral-900/80",
        isOpen ? "translate-x-full" : "translate-x-0"
      )}
      aria-label="Otwórz koszyk"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </div>
    </button>
  );
}
