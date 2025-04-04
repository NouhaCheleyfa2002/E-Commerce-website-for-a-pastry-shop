import React from 'react';
import { useCheckout } from '../context/CheckoutContext';
import { motion } from 'framer-motion';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import ShippingDetails from './ShippingDetails';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';

const steps = ['Shipping Details', 'Order Summary', 'Payment Method'];

const CheckoutStep = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -50 }} 
    className="flex flex-col items-center justify-center min-h-screen py-6 px-4"
  >
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
      {children}
    </div>
  </motion.div>
);

export const CheckoutSteps = () => {
    const { activeStep, handleNext, handleBack, formData, updateFormData } = useCheckout();
    const handleNextClick = () => {
        if (activeStep === 0) {
          const shippingData = formData.shippingDetails; // Get the latest shipping details from context
      
          if (!shippingData || !shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.postalCode || !shippingData.phone) {
            alert("Please fill in all shipping details before proceeding.");
            return; // 🚫 Stop if the form is incomplete
          }
      
          updateFormData('shippingDetails', shippingData); // ✅ Save data (redundant but ensures state sync)
        }
      
        handleNext(); // ✅ Move to the next step
      };
      
         
  

  return (
    <div className="checkout-container">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <CheckoutStep>
        {activeStep === 0 && <ShippingDetails />}
        {activeStep === 1 && <OrderSummary />}
        {activeStep === 2 && <PaymentMethod />}

        <div className="flex justify-between mt-6">
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          <Button variant="contained" onClick={handleNextClick}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </CheckoutStep>
    </div>
  );
};
