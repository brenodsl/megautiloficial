import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchProductPrice } from "@/hooks/useProductPrice";
import cameraMain from "@/assets/camera-main.png";

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
  addItem: (colorId: string, size: number, quantity?: number, customPrice?: number, customOriginalPrice?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  originalPrice: number;
  discount: number;
  discountPercentage: number;
  unitPrice: number;
  displayOriginalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_UNIT_PRICE = 99.00;
const DEFAULT_ORIGINAL_PRICE = 279.80;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [unitPrice, setUnitPrice] = useState(DEFAULT_UNIT_PRICE);
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState(DEFAULT_ORIGINAL_PRICE);

  // Fetch price from database on mount
  useEffect(() => {
    const loadPrice = async () => {
      const priceData = await fetchProductPrice();
      setUnitPrice(priceData.unitPrice);
      setDisplayOriginalPrice(priceData.originalPrice);
    };
    loadPrice();
  }, []);

  const addItem = (colorId: string, size: number, quantity: number = 1, customPrice?: number, customOriginalPrice?: number) => {
    const priceToUse = customPrice ?? unitPrice;
    const originalPriceToUse = customOriginalPrice ?? displayOriginalPrice;
    
    // Get quantity label based on size parameter (which now represents camera count)
    const getQuantityLabel = (cameraCount: number) => {
      if (cameraCount === 1) return "1 Câmera";
      return `Kit ${cameraCount} Câmeras`;
    };

    const newItem: CartItem = {
      id: `camera-${Date.now()}`,
      colorId,
      colorName: getQuantityLabel(size),
      colorImage: cameraMain,
      size, // This now represents camera count
      quantity,
      price: priceToUse,
    };
    
    // Update prices for display
    setUnitPrice(priceToUse);
    setDisplayOriginalPrice(originalPriceToUse);
    
    setItems([newItem]); // Replace cart with new selection
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
  const originalPrice = displayOriginalPrice;
  
  // Discount is already calculated in the price options
  const discount = displayOriginalPrice - unitPrice;
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
      unitPrice,
      displayOriginalPrice,
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
