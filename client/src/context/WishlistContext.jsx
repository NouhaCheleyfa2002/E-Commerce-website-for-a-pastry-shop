import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLogin } from './LoginContext';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const { token, backendUrl } = useLogin();
  const [wishlist, setWishlist] = useState([]);

  // Fetch full populated wishlist
  const fetchWishlist = useCallback(async () => {
    if (!token || !backendUrl) return;
    try {
      const res = await axios.get(
        `${backendUrl}/api/wishlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error.response ? error.response.data : error.message);
    }
  }, [token, backendUrl]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  // Add item to wishlist
  const addItemToWishlist = async (product) => {
    if (!token || !backendUrl) return;
    try {
      await axios.post(
        `${backendUrl}/api/wishlist/add`,
        { productId: product },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // re-fetch so we get populated productId
      await fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error.response ? error.response.data : error.message);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    if (!token || !backendUrl) return;
    try {
      await axios.delete(
        `${backendUrl}/api/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(current => current.filter(item => item.productId._id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error.response ? error.response.data : error.message);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addItemToWishlist, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
