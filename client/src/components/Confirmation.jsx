import React, { useContext, useEffect, useState } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';
import { CartContext } from '../context/CartContext';

const generateOrderNumber = () => {
  return 'PAT' + Math.floor(100000 + Math.random() * 900000); // Example: PAT123456
};

const Confirmation = () => {
  const { formData } = useContext(CheckoutContext);
  const { cart } = useContext(CartContext);
  const shippingDetails = formData?.shippingDetails;

  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
  }, []);

  if (!shippingDetails) {
    return <p>Loading shipping details...</p>;
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="text-gray-800 space-y-4">
      <h2 className="text-2xl font-bold text-[#5f3c1c]">Thank you for your order, {shippingDetails.fullName}!</h2>
      <p className="text-sm text-gray-500">Your order has been successfully placed.</p>

      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Order Number:</strong> #{orderNumber}</p>
        <p><strong>Shipping To:</strong> {shippingDetails.address}, {shippingDetails.city}</p>
        <p><strong>Phone:</strong> {shippingDetails.phone}</p>
        <p><strong>Payment Method:</strong> Monétique</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your treats</h3>
        <ul className="space-y-2">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} TND</span>
            </li>
          ))}
        </ul>
        <hr className="my-2" />
        <p className="text-right font-bold">Total: {total} TND</p>
      </div>
    </div>
  );
};

export default Confirmation;
