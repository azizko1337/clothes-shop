"use client"

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import CartItem from "./CartItem";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function CartSheet() {
  const { isOpen, closeCart, items, total } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-0 flex flex-col gap-0 text-zinc-100">
        <SheetHeader className="p-6 border-b border-zinc-800 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zinc-100" />
            <SheetTitle className="text-lg font-bold uppercase tracking-wider text-zinc-100">Twój Koszyk</SheetTitle>
            <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
        </SheetHeader>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Twój koszyk jest pusty</p>
              <Button variant="outline" onClick={closeCart} className="border-zinc-700 text-zinc-300 hover:bg-zinc-900">
                Wróć do sklepu
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <CartItem key={`${item.product.id}-${item.size}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400 uppercase text-sm tracking-wide">Suma</span>
              <span className="text-xl font-bold font-mono text-white">{total.toFixed(2)} PLN</span>
            </div>
            <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wide h-12">
              PRZEJDŹ DO PŁATNOŚCI
            </Button>
            <p className="text-center text-xs text-zinc-500 mt-4">
              Darmowa dostawa od 500 PLN
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
