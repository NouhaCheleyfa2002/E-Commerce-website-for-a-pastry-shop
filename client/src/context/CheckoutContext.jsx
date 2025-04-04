import React, { createContext, useState, useContext } from 'react';

export const CheckoutContext = createContext();

export const useCheckout = () => useContext(CheckoutContext);

const CheckoutProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  // Initialize formData with default values for shippingDetails, orderSummary, and products
  const [formData, setFormData] = useState({
    shippingDetails: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
    },
    orderSummary: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      products: [], // Store product IDs here
    },
    paymentMethod: {},
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  
  const updateFormData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step], // Ensure previous step data is maintained
        ...data, // Merge new data
      },
    }));
  };

  // Add product IDs to the order summary
  const addProductToOrderSummary = (productId) => {
    setFormData((prev) => ({
      ...prev,
      orderSummary: {
        ...prev.orderSummary,
        products: [...prev.orderSummary.products, productId], // Add the product ID
      },
    }));
  };

  return (
    <CheckoutContext.Provider value={{
      activeStep,
      handleNext,
      handleBack,
      formData,
      updateFormData,
      paymentMethod,
      setPaymentMethod,
      addProductToOrderSummary, // Expose function to add products to the summary
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutProvider;
