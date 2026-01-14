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
let pixelsReady = false;
let pendingEvents: Array<{ eventName: string; eventData?: Record<string, any> }> = [];

// Initialize pixels immediately on module load
const initializePixels = async () => {
  try {
    const { data, error } = await supabase
      .from('pixels')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching pixels:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log(`🎯 Loading ${data.length} active pixels from database`);
      
      // Load each pixel
      data.forEach((pixel) => {
        if (pixel.platform === 'tiktok' && !loadedPixels.has(pixel.pixel_id)) {
          loadTikTokPixel(pixel.pixel_id);
          loadedPixels.add(pixel.pixel_id);
          console.log(`✅ TikTok Pixel loaded: ${pixel.pixel_id} (${pixel.name || 'unnamed'})`);
        }
        if (pixel.platform === 'meta' && !loadedPixels.has(pixel.pixel_id)) {
          loadMetaPixel(pixel.pixel_id);
          loadedPixels.add(pixel.pixel_id);
          console.log(`✅ Meta Pixel loaded: ${pixel.pixel_id} (${pixel.name || 'unnamed'})`);
        }
      });

      // Mark pixels as ready and process pending events
      pixelsReady = true;
      if (pendingEvents.length > 0) {
        console.log(`📤 Processing ${pendingEvents.length} pending events`);
        pendingEvents.forEach(({ eventName, eventData }) => {
          trackPixelEventInternal(eventName, eventData);
        });
        pendingEvents = [];
      }
    }
  } catch (err) {
    console.error('Failed to initialize pixels:', err);
  }
};

// Start loading pixels immediately
initializePixels();

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

// Internal function to track events (used when pixels are ready)
const trackPixelEventInternal = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  const w = window as any;
  
  // Track TikTok events for all loaded TikTok pixels
  if (w.ttq) {
    loadedPixels.forEach((pixelId) => {
      // Check if this is a TikTok pixel instance
      if (w.ttq._i && w.ttq._i[pixelId]) {
        console.log(`📊 TikTok Event [${pixelId}]: ${eventName}`, eventData);
        w.ttq.instance(pixelId).track(eventName, eventData);
      }
    });
  }
  
  // Track Meta/Facebook events
  if (w.fbq) {
    console.log(`📊 Meta Event: ${eventName}`, eventData);
    const metaEventName = mapToMetaEvent(eventName);
    w.fbq('track', metaEventName, eventData);
  }
};

// Track event for all active pixels (queues if pixels not ready)
export const trackPixelEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  // If pixels aren't ready yet, queue the event
  if (!pixelsReady) {
    console.log(`⏳ Queueing event until pixels ready: ${eventName}`);
    pendingEvents.push({ eventName, eventData });
    return;
  }
  
  trackPixelEventInternal(eventName, eventData);
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
