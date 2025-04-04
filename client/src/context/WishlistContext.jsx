import React, { createContext, useState } from 'react';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addItemToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      // Change 'id' to '_id' for MongoDB compatibility
      const existingItem = prevWishlist.find((item) => item._id === product._id);
      if (existingItem) {
        return prevWishlist; // Item already exists in wishlist, no need to add again
      } else {
        return [...prevWishlist, { ...product }];
      }
    });
  };

  const removeItem = (_id) => {
    // Change 'id' to '_id' for MongoDB compatibility
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item._id !== _id));
  };

  const isInWishlist = (_id) => {
    // Change 'id' to '_id' for MongoDB compatibility
    return wishlist.some((item) => item._id === _id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addItemToWishlist, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
