'use client';
import { useEffect, useState } from 'react';

const useDeviceSize = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isClient, setIsClient] = useState(false); // Ensure client-side rendering

  useEffect(() => {
    // Set flag when component is mounted in client
    setIsClient(true);

    const handleWindowResize = () => {
      if (isClient) {
        // Ensure the window object is only accessed on the client
        console.log('WINDOW', window.innerHeight, window.innerWidth);
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
    };

    handleWindowResize(); // Initial call to set the size

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isClient]); // Re-run the effect when `isClient` becomes true

  return [width, height];
};

export default useDeviceSize;
