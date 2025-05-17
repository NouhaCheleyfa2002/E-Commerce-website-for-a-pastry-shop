import { WishlistContext } from '../context/WishlistContext.jsx';
import { FaTrash, FaHeart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { useState, useContext } from "react";

import { FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {

  const { wishlist, removeItem } = useContext(WishlistContext);
   const { addItemToCart } = useContext(CartContext);
    const [cartMessage, setCartMessage] = useState({});

    const handleAddToCart = (item) => {
      addItemToCart(item);
      setCartMessage((prev) => ({
        ...prev,
        [item._id]: "Item added to cart!",
      }));
    
      // Remove from wishlist after adding to cart
      removeItem(item._id);
    
      setTimeout(() => {
        setCartMessage((prev) => ({
          ...prev,
          [item._id]: null,
        }));
      }, 2000);
    };
    

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#5f3c1c] mb-6 mt-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center text-gray-500">
          <FaHeart className="mx-auto text-4xl text-[#490206] mb-3" />
          <p>Your wishlist is empty.</p>
          <p className="mt-2 text-sm">Add items to your wishlist to save them for later.</p>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item, index) => (
                  <tr key={item._id || index}  className="relative">
                   <td className="p-3 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-[25px] object-cover rounded mr-4"
                      />
                      <span className="text-sm">Item Name</span>
                    </td>

                    <td className="p- border">${item.price.toFixed(2)}</td>
                    <td className="p-3 border flex justify-center gap-4">
                     <button 
                      onClick={() => removeItem(item._id)} 
                      className="bg-[#8B5E3C] hover:bg-[#a25b1f] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition duration-300"
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                      Remove
                    </button>

                          {/* Add to Cart Button */}
                     
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-[#8B5E3C] hover:bg-[#a25b1f] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition duration-300"
                        >
                          <FaShoppingCart />
                          Add to Cart
                        </button>

                        <span className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-black text-white py-1 px-2 rounded shadow-md">
                          Add to Cart
                        </span>

                      {cartMessage[item._id] && (
                        <p className="text-[#5f3c1c] mt-4 text-sm">{cartMessage[item._id]}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-600">{wishlist.length} item(s) in your wishlist</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;