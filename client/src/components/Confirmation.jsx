import React, { useContext } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';
import { CartContext } from '../context/CartContext';

const Confirmation = () => {
  const { shippingDetails, paymentMethod } = useContext(CheckoutContext);
  const { cart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Confirmation</h3>
      <p>Shipping to: {shippingDetails.fullName}, {shippingDetails.address}, {shippingDetails.city}</p>
      <p>Payment Method: {paymentMethod}</p>
      <p className="font-bold">Total: {total} TND</p>
      <button className="bg-green-500 text-white px-6 py-2 rounded">Place Order</button>
    </div>
  );
};

export default Confirmation;
