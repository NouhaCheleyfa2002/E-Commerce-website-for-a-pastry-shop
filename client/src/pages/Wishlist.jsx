import { useState, useContext } from "react";
import { WishlistContext } from '../context/WishlistContext.jsx';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaHeart, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
  const { wishlist, removeItem } = useContext(WishlistContext);
  const { addItemToCart } = useContext(CartContext);
  const [cartMessage, setCartMessage] = useState({});

  const handleAddToCart = async (product) => {
    if (!product || !product._id) return;

    // add product to cart
    await addItemToCart(product);
    setCartMessage(prev => ({
      ...prev,
      [product._id]: "Item added to cart!"
    }));

    // remove from wishlist
    await removeItem(product._id);

    setTimeout(() => {
      setCartMessage(prev => ({
        ...prev,
        [product._id]: null
      }));
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#5f3c1c] mb-6 mt-4">My Wishlist</h2>
      {!wishlist.length ? (
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
                {wishlist.map(({ productId: product }) => (
                  <tr key={product._id} className="relative">
                    <td className="p-3 flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-[25px] object-cover rounded mr-4"
                      />
                      <span className="text-sm">{product.name}</span>
                    </td>
                    <td className="p-3 border">
                      {typeof product.price === 'number'
                        ? `$${product.price.toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td className="p-3 border flex flex-col items-center gap-2">
                      <div className="flex gap-4">
                        <button
                          onClick={() => removeItem(product._id)}
                          className="bg-[#8B5E3C] hover:bg-[#a25b1f] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
                          title="Remove from wishlist"
                        >
                          <FaTrash />
                          Remove 
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#8B5E3C] hover:bg-[#a25b1f] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
                          title="Add to cart"  
                        >

                          <FaShoppingCart />
                          Add to cart
                        </button>
                      </div>
                      {cartMessage[product._id] && (
                        <p className="text-[#5f3c1c] text-sm">
                          {cartMessage[product._id]}
                        </p>
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