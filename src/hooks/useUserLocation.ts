import { useState, useEffect } from 'react';

interface UserLocation {
  city: string | null;
  state: string | null;
  loading: boolean;
}

export const useUserLocation = (): UserLocation => {
  const [location, setLocation] = useState<UserLocation>({
    city: null,
    state: null,
    loading: true,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Using a free IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.city && data.region_code) {
          setLocation({
            city: data.city,
            state: data.region_code,
            loading: false,
          });
        } else {
          setLocation({
            city: null,
            state: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation({
          city: null,
          state: null,
          loading: false,
        });
      }
    };

    fetchLocation();
  }, []);

  return location;
};
