import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


const AdminHeader = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  

  useEffect(() => {
    checkAuthStatus(); // Check authentication status on component mount
  }, []);

  return (
    <header className="admin-header">
      {isAuthenticated ? (
        <div>
          <span>Welcome, Admin</span>
          {/* Other admin header content */}
        </div>
      ) : (
        <div>
          <span>Not Authenticated</span>
          {/* Optionally redirect to login page or show a message */}
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
