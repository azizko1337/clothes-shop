"use client"

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import CartItem from "./CartItem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CartSheet() {
  const { isOpen, closeCart, items, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [blikCode, setBlikCode] = useState("");
  const [parcelLockerCode, setParcelLockerCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullAddress = parcelLockerCode 
        ? `${address}\nKod paczkomatu: ${parcelLockerCode}`
        : address;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.size
          })),
          address: fullAddress,
          email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      clearCart();
      closeCart();
      setIsCheckingOut(false);
      setAddress("");
      setEmail("");
      setBlikCode("");
      setParcelLockerCode("");
      setShowSuccessDialog(true);
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas składania zamówienia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) {
        closeCart();
        setIsCheckingOut(false);
      }
    }}>
      <SheetContent className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-0 flex flex-col gap-0 text-zinc-100">
        <SheetHeader className="p-6 border-b border-zinc-800 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            {isCheckingOut ? (
              <Button variant="ghost" size="icon" onClick={() => setIsCheckingOut(false)} className="mr-2 h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            ) : (
              <ShoppingBag className="w-5 h-5 text-zinc-100" />
            )}
            <SheetTitle className="text-lg font-bold uppercase tracking-wider text-zinc-100">
              {isCheckingOut ? "Dostawa" : "Twój Koszyk"}
            </SheetTitle>
            {!isCheckingOut && (
              <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-mono">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
        </SheetHeader>

        {isCheckingOut ? (
          <form onSubmit={handleCheckout} className="flex-grow flex flex-col p-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900 border-zinc-800"
                placeholder="twoj@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adres dostawy</Label>
              <Textarea
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-zinc-900 border-zinc-800 min-h-[100px]"
                placeholder="Ulica, numer domu, kod pocztowy, miasto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parcelLocker">Kod paczkomatu (opcjonalnie)</Label>
              <Input
                id="parcelLocker"
                value={parcelLockerCode}
                onChange={(e) => setParcelLockerCode(e.target.value)}
                className="bg-zinc-900 border-zinc-800"
                placeholder="np. WAW123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blik">Kod BLIK</Label>
              <Input
                id="blik"
                value={blikCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setBlikCode(val);
                }}
                className="bg-zinc-900 border-zinc-800"
                placeholder="000 000"
                maxLength={6}
                inputMode="numeric"
              />
            </div>
            
            <div className="mt-auto space-y-4">
               <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                <span className="text-zinc-400">Suma zamówienia</span>
                <span className="text-xl font-bold font-mono">{total.toFixed(2)} PLN</span>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wide h-12"
              >
                {isSubmitting ? "PRZETWARZANIE..." : "ZŁÓŻ ZAMÓWIENIE"}
              </Button>
            </div>
          </form>
        ) : (
          <>
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
                <Button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wide h-12"
                >
                  PRZEJDŹ DO PŁATNOŚCI
                </Button>
                <p className="text-center text-xs text-zinc-500 mt-4">
                  Darmowa dostawa od 500 PLN
                </p>
              </div>
            )}
          </>
        )}
      </SheetContent>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl">Zamówienie przyjęte!</DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Dziękujemy za zakupy. Potwierdzenie zamówienia zostało wysłane na Twój adres email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200"
              onClick={() => setShowSuccessDialog(false)}
            >
              Wróć do sklepu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
