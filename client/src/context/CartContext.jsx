import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLogin } from './LoginContext'; // adjust import path if needed

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { token, backendUrl } = useLogin();
  const [cart, setCart] = useState([]);

  // Helper: ensure the payload is always an array
  const ensureArray = (data) => (Array.isArray(data) ? data : []);

  // Fetch cart from backend on login or token/backendUrl change
  const getCart = async () => {
    if (!token || !backendUrl) return;
    try {
      const res = await axios.get(`${backendUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(ensureArray(res.data.cartItems));
      console.log('Fetched cart data:', res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    getCart();
  }, [token, backendUrl]);

  // Add item to cart
  const addItemToCart = async (product) => {
    if (!token || !backendUrl) return;
    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await getCart();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  // Update item quantity (refetch complete cart)
  const updateQuantity = async (productId, quantity) => {
    if (!token || !backendUrl) return;
    try {
      await axios.put(
        `${backendUrl}/api/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await getCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  // Remove item (refetch complete cart)
  const removeItem = async (productId) => {
    if (!token || !backendUrl) return;
    try {
      await axios.delete(
        `${backendUrl}/api/cart/remove`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId },
        }
      );
      await getCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!token || !backendUrl) return;
    try {
      await axios.delete(
        `${backendUrl}/api/cart/clear`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart: ensureArray(cart), addItemToCart, getCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => React.useContext(CartContext);
