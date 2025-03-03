import React, { createContext, useState, useContext } from 'react';
import { CartItem, Food } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (food: Food) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (food: Food) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item._id === food._id);
      if (existingItem) {
        return currentItems.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...food, quantity: 1 }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item._id !== foodId)
    );
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item._id === foodId ? { ...item, quantity } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalAmount,
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