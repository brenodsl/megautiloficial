import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Pixel {
  id: string;
  platform: string;
  pixel_id: string;
  is_active: boolean;
  name: string | null;
}

// Track which pixels have been loaded
const loadedPixels = new Set<string>();

export const usePixels = () => {
  const [pixels, setPixels] = useState<Pixel[]>([]);

  useEffect(() => {
    const fetchPixels = async () => {
      const { data, error } = await supabase
        .from('pixels')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching pixels:', error);
        return;
      }

      if (data) {
        setPixels(data);
        
        // Load TikTok pixels dynamically
        data.forEach((pixel) => {
          if (pixel.platform === 'tiktok' && !loadedPixels.has(pixel.pixel_id)) {
            loadTikTokPixel(pixel.pixel_id);
            loadedPixels.add(pixel.pixel_id);
          }
          // Add support for other platforms here (Meta, Google, etc.)
          if (pixel.platform === 'meta' && !loadedPixels.has(pixel.pixel_id)) {
            loadMetaPixel(pixel.pixel_id);
            loadedPixels.add(pixel.pixel_id);
          }
        });
      }
    };

    fetchPixels();
  }, []);

  return pixels;
};

// Load TikTok Pixel dynamically
const loadTikTokPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;
  
  const w = window as any;
  
  // Initialize ttq if not exists
  if (!w.ttq) {
    w.TiktokAnalyticsObject = 'ttq';
    w.ttq = w.ttq || [];
    w.ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
    w.ttq.setAndDefer = function(t: any, e: string) {
      t[e] = function() {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (let i = 0; i < w.ttq.methods.length; i++) {
      w.ttq.setAndDefer(w.ttq, w.ttq.methods[i]);
    }
    w.ttq.instance = function(t: string) {
      const e = w.ttq._i[t] || [];
      for (let n = 0; n < w.ttq.methods.length; n++) {
        w.ttq.setAndDefer(e, w.ttq.methods[n]);
      }
      return e;
    };
    w.ttq.load = function(e: string, n?: any) {
      const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
      w.ttq._i = w.ttq._i || {};
      w.ttq._i[e] = [];
      w.ttq._i[e]._u = r;
      w.ttq._t = w.ttq._t || {};
      w.ttq._t[e] = +new Date();
      w.ttq._o = w.ttq._o || {};
      w.ttq._o[e] = n || {};
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = r + "?sdkid=" + e + "&lib=ttq";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    };
  }
  
  // Load the pixel
  console.log(`Loading TikTok Pixel: ${pixelId}`);
  w.ttq.load(pixelId);
  w.ttq.page();
};

// Load Meta/Facebook Pixel dynamically
const loadMetaPixel = (pixelId: string) => {
  if (typeof window === 'undefined') return;
  
  const w = window as any;
  
  // Initialize fbq if not exists
  if (!w.fbq) {
    const fbq: any = function(...args: any[]) {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, args);
      } else {
        fbq.queue.push(args);
      }
    };
    if (!w._fbq) w._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    w.fbq = fbq;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }
  
  console.log(`Loading Meta Pixel: ${pixelId}`);
  w.fbq('init', pixelId);
  w.fbq('track', 'PageView');
};

// Track event for all active pixels
export const trackPixelEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  const w = window as any;
  
  // Track TikTok events
  if (w.ttq) {
    console.log(`Tracking TikTok event: ${eventName}`, eventData);
    w.ttq.track(eventName, eventData);
  }
  
  // Track Meta/Facebook events
  if (w.fbq) {
    console.log(`Tracking Meta event: ${eventName}`, eventData);
    // Map TikTok event names to Meta event names
    const metaEventName = mapToMetaEvent(eventName);
    w.fbq('track', metaEventName, eventData);
  }
};

// Map TikTok event names to Meta event names
const mapToMetaEvent = (tiktokEvent: string): string => {
  const eventMap: Record<string, string> = {
    'ViewContent': 'ViewContent',
    'AddToCart': 'AddToCart',
    'InitiateCheckout': 'InitiateCheckout',
    'CompletePayment': 'Purchase',
  };
  return eventMap[tiktokEvent] || tiktokEvent;
};
