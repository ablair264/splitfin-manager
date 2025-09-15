import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { shopifyAuth } from '../services/shopifyAuthService';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function ShopifyPrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await shopifyAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Checking authentication...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" state={{ from: location }} />;
}