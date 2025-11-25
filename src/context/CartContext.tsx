"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/generated/client/client';

export interface CartItem {
  product: Product & { images: { id: number }[] };
  quantity: number;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product & { images: { id: number }[] }, size?: string) => void;
  removeItem: (productId: number, size?: string) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product & { images: { id: number }[] }, size?: string) => {
    if (!product.isActive) return;
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        return [...prevItems, { product, quantity: 1, size }];
      }
    });
    setIsOpen(true); // Open cart when adding item
  };

  const removeItem = (productId: number, size?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        total,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
