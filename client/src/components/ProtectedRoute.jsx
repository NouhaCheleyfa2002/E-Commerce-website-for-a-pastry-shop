import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLogin } from '../context/LoginContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuthStatus } = useAdmin();
  const { setShowLogin } = useLogin(); // Access login modal toggle
  const [loading, setLoading] = useState(true); // Add loading state

  // Temporary flag to bypass authentication during development
  const bypassAuth = true; // Set to `true` to bypass authentication

  useEffect(() => {
    const checkAuth = async () => {
      if (!bypassAuth) {
        await checkAuthStatus();  // Ensure checkAuthStatus runs asynchronously
      }
      setLoading(false); // Set loading to false once authentication check is complete
    };

    checkAuth();
  }, [checkAuthStatus]);

  // Use another effect to set the login modal when not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading && !bypassAuth) {
      setShowLogin(true);  // Open login modal instead of redirecting
    }
  }, [isAuthenticated, loading, setShowLogin, bypassAuth]); // Only trigger when isAuthenticated or loading changes

  if (loading) {
    return <div>Loading...</div>; // Optionally add a loading state
  }

  if (!isAuthenticated && !bypassAuth) {
    return null; // Don't render anything yet while waiting for the login
  }

  return children; // Render the protected content if authenticated or bypassed
};

export default ProtectedRoute;
