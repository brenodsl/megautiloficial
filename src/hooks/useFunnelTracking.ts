import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate or get session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('funnel_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('funnel_session_id', sessionId);
  }
  return sessionId;
};

export type FunnelEventType = 
  | 'page_view'
  | 'product_view'
  | 'kit_selected'
  | 'add_to_cart'
  | 'checkout_started'
  | 'checkout_step_1'
  | 'checkout_step_2'
  | 'checkout_step_3'
  | 'pix_generated'
  | 'payment_confirmed'
  | 'checkout_abandoned'
  | 'scroll_depth'
  | 'time_on_page'
  | 'button_click';

interface FunnelEventData {
  [key: string]: string | number | boolean | undefined;
}

export const trackFunnelEvent = async (
  eventType: FunnelEventType,
  page: string,
  eventData?: FunnelEventData
) => {
  try {
    const sessionId = getSessionId();
    
    await supabase
      .from('funnel_events')
      .insert({
        session_id: sessionId,
        event_type: eventType,
        page,
        event_data: eventData || {}
      });
  } catch (error) {
    console.error('Error tracking funnel event:', error);
  }
};

export const useFunnelTracking = (page: string) => {
  const hasTrackedPageView = useRef(false);
  const startTime = useRef(Date.now());

  // Track page view on mount
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      trackFunnelEvent('page_view', page);
      hasTrackedPageView.current = true;
      startTime.current = Date.now();
    }

    // Track time on page when leaving
    return () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      if (timeSpent > 3) { // Only track if more than 3 seconds
        trackFunnelEvent('time_on_page', page, { seconds: timeSpent });
      }
    };
  }, [page]);

  const trackEvent = useCallback((eventType: FunnelEventType, eventData?: FunnelEventData) => {
    trackFunnelEvent(eventType, page, eventData);
  }, [page]);

  return { trackEvent };
};

export default useFunnelTracking;
