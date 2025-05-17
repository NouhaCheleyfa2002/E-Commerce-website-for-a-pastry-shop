import React, { useContext } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';

const PaymentMethod = () => {
  const { paymentMethod, setPaymentMethod } = useContext(CheckoutContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-6 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-[#5f3c1c]">Select Payment Method</h3>

        <div className="space-y-4">
          <label className="flex items-center space-x-3 text-lg cursor-pointer">
            <input 
              type="radio" 
              value="Stripe" 
              checked={paymentMethod === 'Stripe'} 
              onChange={() => setPaymentMethod('Stripe')} 
              className="h-5 w-5 text-[#5f3c1c] border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Stripe</span>
          </label>

          <label className="flex items-center space-x-3 text-lg cursor-pointer">
            <input 
              type="radio" 
              value="PayPal" 
              checked={paymentMethod === 'PayPal'} 
              onChange={() => setPaymentMethod('PayPal')} 
              className="h-5 w-5 text-[#5f3c1c]border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">PayPal</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
