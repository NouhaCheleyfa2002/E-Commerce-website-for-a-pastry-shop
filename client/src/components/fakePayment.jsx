// FakePaymentStep.jsx
import React, { useState } from 'react';

const FakePaymentStep = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMockPayment = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      // Simulate success or failure randomly
      const success = true; // Change to `Math.random() > 0.2` for randomness
      if (success) {
        setLoading(false);
        onPaymentSuccess(); // proceed to next step
      } else {
        setLoading(false);
        setError('Payment failed. Please try again.');
      }
    }, 2000); // Simulate network delay
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-bold">Pay with Monétique</h2>
      <p>This is a mock payment. Click the button to simulate.</p>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleMockPayment}
        disabled={loading}
        className="bg-[#5f3c1c] text-white px-6 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default FakePaymentStep;
