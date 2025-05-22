import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const [detailedCart, setDetailedCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Enrich cart items locally (assuming productId holds details)
  useEffect(() => {
    if (!Array.isArray(cart)) {
      setDetailedCart([]);
      setLoading(false);
      return;
    }

    const enriched = cart
      .map(({ productId, quantity }) => {
        // Ensure productId is an object with expected fields
        const id = productId?._id || '';
        const name = productId?.name || 'Unknown';
        const image = productId?.image || '';
        const price = typeof productId?.price === 'number' ? productId.price : 0;
        return { _id: id, name, image, price, quantity };
      })
      .filter(item => item._id);

    console.log('Detailed cart items:', enriched);
    setDetailedCart(enriched);
    setLoading(false);
  }, [cart]);

  // Safely compute total
  const totalPrice = detailedCart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (detailedCart.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-[#5f3c1c] mb-6">Shopping Cart</h2>
        <p className="text-center text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#5f3c1c] mb-6">Shopping Cart</h2>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Item</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Subtotal</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {detailedCart.map(item => {
                const price = item.price ?? 0;
                return (
                  <tr key={item._id} className="border">
                    <td className="p-3 border flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded-md mr-4"
                        />
                      )}
                      <span>{item.name}</span>
                    </td>
                    <td className="p-3 border">${price.toFixed(2)}</td>
                    <td className="p-3 border flex justify-center items-center">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className={`px-2 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-2"
                      >
                        <FaPlus />
                      </button>
                    </td>
                    <td className="p-3 border">${(price * item.quantity).toFixed(2)}</td>
                    <td className="p-3 border">
                      <button onClick={() => removeItem(item._id)} className="text-[#5f3c1c]">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-right">
          <h3 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h3>
          <button
            onClick={() => navigate('/Checkout')}
            className="mt-4 bg-[#5f3c1c] text-white px-6 py-2 rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
