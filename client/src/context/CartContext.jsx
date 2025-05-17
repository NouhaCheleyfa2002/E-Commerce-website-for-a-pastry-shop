import React, { createContext, useState, useEffect} from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
});

useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);

const addItemToCart = (product) => {
    setCart((prevCart) => {
        const existingProduct = prevCart.find(item => item._id === product._id);

        if (existingProduct) {
            return prevCart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            return [...prevCart, { ...product, quantity: 1 }];
        }
    });
};

const updateQuantity = (id, quantity) => {
  setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
          item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );

      return updatedCart;
  });
};

const removeItem = (id) => {
  setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== id);

      return updatedCart;
  });
};

const clearCart = () => {
  setCart([]);
};

  return (
    <CartContext.Provider value={{ cart, addItemToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;

export const useCart = () => React.useContext(CartContext);
