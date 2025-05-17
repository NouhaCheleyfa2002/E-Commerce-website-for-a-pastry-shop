import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const { cart, updateQuantity, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#5f3c1c] mb-6">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border">
                    <td className="p-3 border flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-[17px] object-cover rounded-md mr-4"
                      />
                      <span>{item.name}</span>
                    </td>

                    <td className="p-3 border">${item.price.toFixed(2)}</td>
                    <td className="p-3 border flex justify-center items-center">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2">
                        <FaMinus />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2">
                        <FaPlus />
                      </button>
                    </td>
                    <td className="p-3 border">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="p-3 border">
                      <button onClick={() => removeItem(item._id)} className="text-[#5f3c1c]">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-right">
            <h3 className="text-xl font-semibold">
              Total: $
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </h3>
            <button onClick={() => navigate("/Checkout")} className="mt-4 bg-[#5f3c1c] text-white px-6 py-2 rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
