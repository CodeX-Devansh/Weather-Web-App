import { useState } from 'react';

const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser.';
        setError(errorMsg);
        reject(errorMsg);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve(position);
        },
        (err) => {
          const errorMsg = `Error (${err.code}): ${err.message}`;
          setLoading(false);
          setError(errorMsg);
          reject(errorMsg);
        }
      );
    });
  };

  return { getLocation, loading, error };
};

export default useCurrentLocation;