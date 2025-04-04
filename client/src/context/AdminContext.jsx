import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  const checkAuthStatus = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true); // Admin is authenticated
    } else {
      setIsAuthenticated(false); // Admin is not authenticated
    }
  };

  // Functions for managing products
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((product) => product.id === updatedProduct.id ? updatedProduct : product));
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  return (
    <AdminContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, orders, users, isAuthenticated, checkAuthStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
