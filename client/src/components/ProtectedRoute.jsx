import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useLogin } from '../context/LoginContext';

const ProtectedRoute = () => {
  const { isAuthenticated, checkAuthStatus } = useAdmin();
  const { setShowLogin } = useLogin();
  const [loading, setLoading] = useState(true);

  const bypassAuth = true;

  useEffect(() => {
    const checkAuth = async () => {
      if (!bypassAuth) {
        await checkAuthStatus();
      }
      setLoading(false);
    };

    checkAuth();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (!isAuthenticated && !loading && !bypassAuth) {
      setShowLogin(true);
    }
  }, [isAuthenticated, loading, setShowLogin, bypassAuth]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated && !bypassAuth) return null;

  return <Outlet />;
};

export default ProtectedRoute;
