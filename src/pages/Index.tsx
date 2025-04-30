
import React, { useEffect } from 'react';
import HomePage from './HomePage';

const Index = () => {
  useEffect(() => {
    // Ensure the page starts at the top when this component mounts
    window.scrollTo(0, 0);
  }, []);

  return <HomePage />;
};

export default Index;
