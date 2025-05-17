import React from 'react';
import { useCheckout } from '../context/CheckoutContext';
import { motion } from 'framer-motion';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import ShippingDetails from './ShippingDetails';
import OrderSummary from './OrderSummary';
import Confirmation from './Confirmation';
import FakePaymentStep from './fakePayment'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';



const steps = ['Shipping Details', 'Order Summary', 'Payment', 'Confirmation'];

const CheckoutStep = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -50 }} 
    className="flex flex-col items-center justify-center min-h-screen py-6 px-4 "
  >
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg ">
      {children}
    </div>
  </motion.div>
);

export const CheckoutSteps = () => {
  const { activeStep, handleNext, handleBack, formData, updateFormData } = useCheckout();

  const { clearCart } = useCart();

  const navigate = useNavigate();


  const handleNextClick = () => {
    if (activeStep === 0) {
      const shippingData = formData.shippingDetails;

      if (!shippingData || !shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.postalCode || !shippingData.phone) {
        alert("Please fill in all shipping details before proceeding.");
        return;
      }

      updateFormData('shippingDetails', shippingData);
    }

    if (activeStep === 1) {
      updateFormData('paymentMethod', 'Monétique'); // Default static method
    }

    handleNext();
  };

  return (
    <div className="checkout-container mx-auto max-w-screen-md p-10 mt-4 ">
      <Stepper activeStep={activeStep} alternativeLabel className="mb-3">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              sx={{
                '&.MuiStepLabel-active': {
                  color: '#5f3c1c',  // Active step color
                },
                '&.MuiStepLabel-completed': {
                  color: '#5f3c1c',  // Completed step color
                },
                '&.MuiStepLabel-root': {
                  color: '#5f3c1c',  // Default color
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <CheckoutStep>
        {activeStep === 0 && <ShippingDetails />}
        {activeStep === 1 && <OrderSummary />}
        {activeStep === 2 && (
          <FakePaymentStep
            onPaymentSuccess={() => {
              handleNext();
            }}
          />
        )}
        {activeStep === 3 && <Confirmation />}

        <div className="flex justify-between items-center mt-8 space-x-4">
          <Button 
            disabled={activeStep === 0} 
            color='#5f3c1c'
            onClick={handleBack} 
            variant="outlined"
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                toast.success('🎉 Thank you for your order!', {
                  position: "top-center",
                  autoClose: 4000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light"
                });

                clearCart();

                // Navigate after short delay so the toast is visible
                setTimeout(() => {
                  navigate('/');
                }, 1000); // 1s delay before navigating
              } else {
                handleNextClick();
              }
            }}
            style={{ backgroundColor: "#5f3c1c" }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>

        </div>
      </CheckoutStep>
    </div>
  );
};
