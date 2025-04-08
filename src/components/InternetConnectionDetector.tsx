import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InternetConnectionDetector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Handler functions
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection status on mount
    setIsOnline(navigator.onLine);
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    // If offline and not already on the 503 page, navigate to it
    if (!isOnline && location.pathname !== '/service-unavailable') {
      navigate('/service-unavailable');
    }
    
    // If online and on the 503 page, navigate back to home
    if (isOnline && location.pathname === '/service-unavailable') {
      navigate('/');
    }
  }, [isOnline, location.pathname, navigate]);
  
  return null; // This component doesn't render anything
};

export default InternetConnectionDetector;