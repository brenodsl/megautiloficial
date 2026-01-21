import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchProductPrice } from "@/hooks/useProductPrice";

export interface CameraCartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CameraCartContextType {
  items: CameraCartItem[];
  addItem: (quantity?: number) => void;
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

const CameraCartContext = createContext<CameraCartContextType | undefined>(undefined);

const DEFAULT_UNIT_PRICE = 143.40;
const DEFAULT_ORIGINAL_PRICE = 224.00;

export const CameraCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CameraCartItem[]>([]);
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

  const addItem = (quantity: number = 1) => {
    const existingItem = items.find(item => item.name === "Câmera P11");

    if (existingItem) {
      setItems(items.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CameraCartItem = {
        id: `camera-p11-${Date.now()}`,
        name: "Câmera P11",
        quantity,
        price: unitPrice,
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
  const originalPrice = items.reduce((sum, item) => sum + (displayOriginalPrice * item.quantity), 0);
  const totalPrice = items.reduce((sum, item) => sum + (unitPrice * item.quantity), 0);
  const discount = originalPrice - totalPrice;
  const discountPercentage = originalPrice > 0 ? (discount / originalPrice) * 100 : 0;

  return (
    <CameraCartContext.Provider value={{
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
    </CameraCartContext.Provider>
  );
};

export const useCameraCart = () => {
  const context = useContext(CameraCartContext);
  if (!context) {
    throw new Error("useCameraCart must be used within a CameraCartProvider");
  }
  return context;
};
