import React, { useContext, useState, useEffect } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';

const ShippingDetails = () => {
  const { formData, updateFormData } = useContext(CheckoutContext);
  
  // Set initial state to formData.shippingDetails, or fallback to default if not yet populated
  const [formDataState, setFormDataState] = useState(formData.shippingDetails || {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const handleChange = (e) => {
    const updatedData = { ...formDataState, [e.target.name]: e.target.value };
    setFormDataState(updatedData);
    updateFormData('shippingDetails', updatedData); // Sync with CheckoutContext
  };

  const handleSubmit = () => {
    if (!formDataState.fullName || !formDataState.address || !formDataState.city || !formDataState.postalCode || !formDataState.phone) {
      alert('Please fill in all fields.');
      return false;
    }
  
    updateFormData('shippingDetails', formDataState);
    return true; 
  };
  

  useEffect(() => {
    // Sync formDataState with the context whenever formData.shippingDetails changes
    if (formData.shippingDetails) {
      setFormDataState({ ...formData.shippingDetails });
    }
  }, [formData.shippingDetails]);

  return (
    <div className="flex flex-col items-center justify-center h-[500px] p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-[#5f3c1c]">Shipping Details</h3>
        <div className="space-y-4">
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            value={formDataState.fullName} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5f3c1c]"
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Address" 
            value={formDataState.address} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5f3c1c]"
          />
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={formDataState.city} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5f3c1c]"
          />
          <input 
            type="text" 
            name="postalCode" 
            placeholder="Postal Code" 
            value={formDataState.postalCode} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5f3c1c]"
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone" 
            value={formDataState.phone} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5f3c1c]"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
