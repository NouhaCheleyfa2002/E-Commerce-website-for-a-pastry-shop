import React, { createContext, useState, useContext } from "react";
import axios from 'axios';

// Create the LoginContext
export const LoginContext = createContext();

// Custom Hook
export const useLogin = () => {
  return useContext(LoginContext);
};

const AppContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('token') || '';
    if (saved) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
    }
    return saved;//it automatically sets the header if the user refreshes the page.
  });
  

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization']; 
    setToken('');
    setUser(null);
  };
  

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    logout,
  };

  

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default AppContextProvider;
