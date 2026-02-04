import { useCallback, useRef } from 'react';

// Sound URLs - using web audio data URIs for notification sounds
const SOUNDS = {
  // Payment generated - short chime
  pixGenerated: 'data:audio/wav;base64,UklGRl4DAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YToDAAC4mJiYmJi4OLiYmJiYmLg4uJiYmJiYuDi4mJiYmJi4OLiYmJiYmLg4uJiYmJiYuDiAODg4ODg4gDg4ODg4ODiAODg4ODg4OIA4ODg4ODg4gDg4ODg4ODiAODg4ODg4OIDAwMDAwMDAgMDAwMDAwMCAwMDAwMDAwIDAwMDAwMDAgMDAwMDAwMCA+Pj4+Pj4+ID4+Pj4+Pj4gPj4+Pj4+PiA+Pj4+Pj4+ID4+Pj4+Pj4gHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4wMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+PjQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0A==',
  
  // Payment confirmed - success melody  
  paymentConfirmed: 'data:audio/wav;base64,UklGRoQFAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YWAFAAB4ODg4ODg4eHg4ODg4ODh4eDg4ODg4OHh4ODg4ODg4eHg4ODg4ODh4eDg4ODg4OHh4ODg4ODg4eHg4ODg4ODh4eDg4ODg4OHh4ODg4ODg4eHg4ODg4ODh4eDg4ODg4OHh4ODg4ODg4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAQDg4ODg4OEA4ODg4ODg4QDg4ODg4ODhAODg4ODg4OEA4ODg4ODg4QDg4ODg4ODhA+Pj4+Pj4+ID4+Pj4+Pj4gPj4+Pj4+PiA+Pj4+Pj4+ID4+Pj4+Pj4gPj4+Pj4+PiA+Pj4+Pj4+ID4+Pj4+Pj4g8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODhAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMPDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PA0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI',
};

export type SoundType = keyof typeof SOUNDS;

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: SoundType) => {
    try {
      // Create audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const audio = new Audio(SOUNDS[type]);
      audio.volume = 0.6;
      audio.play().catch(err => {
        console.log('Audio play failed (likely user interaction required):', err);
      });
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  }, []);

  const playPixGenerated = useCallback(() => {
    playSound('pixGenerated');
  }, [playSound]);

  const playPaymentConfirmed = useCallback(() => {
    playSound('paymentConfirmed');
  }, [playSound]);

  return {
    playSound,
    playPixGenerated,
    playPaymentConfirmed,
  };
};

// Standalone function for use outside React components
export const playNotificationSound = (type: SoundType) => {
  try {
    const audio = new Audio(SOUNDS[type]);
    audio.volume = 0.6;
    audio.play().catch(err => {
      console.log('Audio play failed:', err);
    });
  } catch (error) {
    console.log('Error playing notification sound:', error);
  }
};
