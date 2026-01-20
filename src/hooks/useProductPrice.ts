import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductPrice {
  unitPrice: number;
  originalPrice: number;
}

const DEFAULT_PRICE: ProductPrice = {
  unitPrice: 77.98,
  originalPrice: 239.80,
};

export const useProductPrice = () => {
  const [price, setPrice] = useState<ProductPrice>(DEFAULT_PRICE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_key', 'product_price')
          .maybeSingle();

        if (error) {
          console.error('Error fetching product price:', error);
          return;
        }

        if (data?.setting_value) {
          const value = data.setting_value as { unit_price?: number; original_price?: number };
          setPrice({
            unitPrice: value.unit_price ?? DEFAULT_PRICE.unitPrice,
            originalPrice: value.original_price ?? DEFAULT_PRICE.originalPrice,
          });
        }
      } catch (error) {
        console.error('Error fetching product price:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, []);

  return { ...price, isLoading };
};

// Function to fetch price synchronously (for contexts/initial load)
export const fetchProductPrice = async (): Promise<ProductPrice> => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'product_price')
      .maybeSingle();

    if (error || !data?.setting_value) {
      return DEFAULT_PRICE;
    }

    const value = data.setting_value as { unit_price?: number; original_price?: number };
    return {
      unitPrice: value.unit_price ?? DEFAULT_PRICE.unitPrice,
      originalPrice: value.original_price ?? DEFAULT_PRICE.originalPrice,
    };
  } catch {
    return DEFAULT_PRICE;
  }
};

export const updateProductPrice = async (unitPrice: number, originalPrice: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert({
        setting_key: 'product_price',
        setting_value: { unit_price: unitPrice, original_price: originalPrice },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'setting_key' });

    if (error) {
      console.error('Error updating product price:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating product price:', error);
    return false;
  }
};
