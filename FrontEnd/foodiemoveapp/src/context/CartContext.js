import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : { restaurantId: null, items: [] };
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (restaurantId, item) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      setCart({ restaurantId, items: [item] });
      return;
    }
    const existing = cart.items.find(i => i.itemID === item.itemID);
    if (existing) {
      setCart(prev => ({
        ...prev,
        items: prev.items.map(i =>
          i.itemID === item.itemID ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      }));
    } else {
      setCart(prev => ({ ...prev, restaurantId, items: [...prev.items, item] }));
    }
  };

  const removeItem = (itemID) => {
    setCart(prev => {
      const items = prev.items.filter(i => i.itemID !== itemID);
      return { restaurantId: items.length ? prev.restaurantId : null, items };
    });
  };

  const clearCart = () => setCart({ restaurantId: null, items: [] });

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
