// components/CartContext.tsx
import React, { createContext, useState } from "react";

export interface CartItem {
  itemID: number;
  name: string;
  description: string;
  price: number;
  variant?: string;
  imagePath?: string | null;
  availability: boolean;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (item: Omit<CartItem, "quantity">) => void;
  removeItemCompletely: (item: Omit<CartItem, "quantity">) => void; // ✅ add this
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.itemID === item.itemID);
      if (existing) {
        return prev.map((c) =>
          c.itemID === item.itemID ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.itemID === item.itemID);
      if (existing?.quantity === 1) {
        return prev.filter((c) => c.itemID !== item.itemID);
      }
      return prev.map((c) =>
        c.itemID === item.itemID ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  };

  const removeItemCompletely = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => prev.filter((c) => c.itemID !== item.itemID));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeItemCompletely }}>
      {children}
    </CartContext.Provider>
  );
};
