import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { FaTrash, FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  const { wishlist, removeItem } = useContext(WishlistContext);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center text-gray-500">
          <FaHeart className="mx-auto text-4xl text-[#490206] mb-3" />
          <p>Your wishlist is empty.</p>
          <p className="mt-2 text-sm">Add items to your wishlist to save them for later.</p>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item, index) => (
                  <tr key={item.id || index}  className="relative">
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">${item.price.toFixed(2)}</td>
                    <td className="p-3 border flex justify-center">
                      <button 
                        key={`remove-${item.id}`}
                        onClick={() => removeItem(item.id)} 
                        className="text-red-500"
                        title="Remove from wishlist"
                      >
                        <FaTrash />
                      </button>
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