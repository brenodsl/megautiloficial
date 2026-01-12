import { useEffect } from 'react';
import { usePixels } from '@/hooks/usePixels';

interface PixelProviderProps {
  children: React.ReactNode;
}

const PixelProvider = ({ children }: PixelProviderProps) => {
  // This hook loads all active pixels from the database
  const pixels = usePixels();

  useEffect(() => {
    if (pixels.length > 0) {
      console.log(`Loaded ${pixels.length} active pixels:`, pixels.map(p => `${p.platform}: ${p.pixel_id}`));
    }
  }, [pixels]);

  return <>{children}</>;
};

export default PixelProvider;
