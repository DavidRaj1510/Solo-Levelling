
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-solo-dark-bg">
      <div className="text-center max-w-md px-4">
        <h1 className="text-5xl font-bold text-solo-purple mb-4">404</h1>
        <p className="text-xl text-white mb-8">
          This gate hasn't been opened yet, Hunter.
        </p>
        <Link to="/" className="solo-button animate-shadow-pulse">
          Return to Base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
