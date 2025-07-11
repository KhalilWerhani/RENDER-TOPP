// components/LoadingWrapper.jsx
import { useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';
const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for necessary data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <LoadingPage /> : children;
};

export default LoadingWrapper;