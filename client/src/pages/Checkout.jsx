import React from 'react';
import  CheckoutProvider  from '../context/CheckoutContext';
import { CheckoutSteps } from '../components/CheckoutSteps';

const CheckoutPage = () => {
  return (
    <CheckoutProvider>
      <CheckoutSteps />
    </CheckoutProvider>
  );
};

export default CheckoutPage;
