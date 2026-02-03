import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KitPriceOption {
  quantity: number;
  label: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  isPopular?: boolean;
}

const DEFAULT_KIT_PRICES: KitPriceOption[] = [
  { quantity: 1, label: "1 Und", originalPrice: 157.00, salePrice: 65.80, savings: 0 },
  { quantity: 2, label: "Kit 2 Und", originalPrice: 314.00, salePrice: 119.90, savings: 194.10 },
  { quantity: 3, label: "Kit 3 Und", originalPrice: 471.00, salePrice: 159.90, savings: 311.10, isPopular: true },
  { quantity: 4, label: "Kit 4 Und", originalPrice: 628.00, salePrice: 199.90, savings: 428.10 },
];

interface KitPricingConfig {
  kits: KitPriceOption[];
}

export const useKitPricing = () => {
  const [kitPrices, setKitPrices] = useState<KitPriceOption[]>(DEFAULT_KIT_PRICES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKitPrices = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_key', 'kit_pricing')
          .maybeSingle();

        if (error) {
          console.error('Error fetching kit pricing:', error);
          return;
        }

        if (data?.setting_value) {
          const config = data.setting_value as unknown as KitPricingConfig;
          if (config.kits && Array.isArray(config.kits)) {
            // Recalculate savings based on current prices
            const kitsWithSavings = config.kits.map(kit => ({
              ...kit,
              savings: kit.originalPrice - kit.salePrice
            }));
            setKitPrices(kitsWithSavings);
          }
        }
      } catch (error) {
        console.error('Error fetching kit pricing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKitPrices();
  }, []);

  return { kitPrices, isLoading };
};

export const fetchKitPricing = async (): Promise<KitPriceOption[]> => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'kit_pricing')
      .maybeSingle();

    if (error || !data?.setting_value) {
      return DEFAULT_KIT_PRICES;
    }

    const config = data.setting_value as unknown as KitPricingConfig;
    if (config.kits && Array.isArray(config.kits)) {
      return config.kits.map(kit => ({
        ...kit,
        savings: kit.originalPrice - kit.salePrice
      }));
    }

    return DEFAULT_KIT_PRICES;
  } catch {
    return DEFAULT_KIT_PRICES;
  }
};

export const updateKitPricing = async (kits: KitPriceOption[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert([{
        setting_key: 'kit_pricing',
        setting_value: JSON.parse(JSON.stringify({ kits })),
        updated_at: new Date().toISOString(),
      }], { onConflict: 'setting_key' });

    if (error) {
      console.error('Error updating kit pricing:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating kit pricing:', error);
    return false;
  }
};

export { DEFAULT_KIT_PRICES };
