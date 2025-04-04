import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { CheckoutContext } from '../context/CheckoutContext';

const OrderSummary = () => {
  const { cart } = useContext(CartContext);
  const { formData } = useContext(CheckoutContext);
  
  const shippingDetails = formData.shippingDetails || {
    fullName: 'N/A',
    address: 'N/A',
    city: 'N/A',
    postalCode: 'N/A',
    phone: 'N/A',
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-6 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600">Order Summary</h3>
        
        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-2">Items in Your Cart:</h4>
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between text-lg">
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price} TND</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 mb-6">
          <p className="text-lg font-bold">Total: <span className="text-blue-600">{total} TND</span></p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h4 className="text-xl font-semibold mb-4">Shipping To:</h4>
          <div className="space-y-2 text-lg">
            <p>{shippingDetails.fullName}</p>
            <p>{shippingDetails.address}</p>
            <p>{shippingDetails.city}</p>
            <p>{shippingDetails.postalCode}</p>
            <p>{shippingDetails.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
