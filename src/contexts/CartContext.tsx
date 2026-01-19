import React, { createContext, useContext, useState, ReactNode } from "react";
import { colors, ColorOption } from "@/components/ColorSelector";

export interface CartItem {
  id: string;
  colorId: string;
  colorName: string;
  colorImage: string;
  size: number;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (colorId: string, size: number, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  originalPrice: number;
  discount: number;
  discountPercentage: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const UNIT_PRICE = 77.98;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (colorId: string, size: number, quantity: number = 1) => {
    const color = colors.find(c => c.id === colorId);
    if (!color) return;

    const existingItem = items.find(
      item => item.colorId === colorId && item.size === size
    );

    if (existingItem) {
      setItems(items.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `${colorId}-${size}-${Date.now()}`,
        colorId,
        colorName: color.name,
        colorImage: color.image,
        size,
        quantity,
        price: UNIT_PRICE,
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const originalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate progressive discount: 2nd pair onwards gets 20% off
  const calculateDiscount = () => {
    if (totalItems < 2) return 0;
    // First item is full price, remaining items get 20% off
    const discountedItems = totalItems - 1;
    return discountedItems * UNIT_PRICE * 0.20;
  };
  
  const discount = calculateDiscount();
  const totalPrice = originalPrice - discount;
  const discountPercentage = originalPrice > 0 ? (discount / originalPrice) * 100 : 0;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      originalPrice,
      discount,
      discountPercentage,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
