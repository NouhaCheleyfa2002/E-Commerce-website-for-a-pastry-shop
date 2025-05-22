import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLogin } from './LoginContext'; // adjust import path if needed


export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { token, backendUrl } = useLogin();
  const [cart, setCart] = useState([]);

  // Fetch cart from backend on login
  const getCart = async () => {
    if (!token) return;
  
    try {
      const res = await axios.get(`${backendUrl}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setCart(res.data.cartItems || []);
      console.log("Fetched cart data:", res.data);
  
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };
  
  useEffect(() => {
    getCart(); 
  }, [token, backendUrl]);
  

  // Add item to cart
  const addItemToCart = async (product) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Added to cart:", res.data);
      getCart();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        setCart(res.data); // because backend returns updated cart directly
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };
  

  // Remove item
  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId }, // pass in `data`
      });
      if (res.data) {
        setCart(res.data); // backend sends updated cart
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };  

  // Optional: Clear cart
  const clearCart = async () => {
    try {
      await axios.delete(`${backendUrl}/api/cart/clear`, { headers: {Authorization: `Bearer ${token}` } });
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };
  

  return (
    <CartContext.Provider value={{ cart, addItemToCart,getCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => React.useContext(CartContext);
