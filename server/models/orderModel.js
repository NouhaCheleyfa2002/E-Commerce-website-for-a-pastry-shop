import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number,
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: 'pending', // can be 'pending', 'shipped', 'delivered', etc.
  },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  paymentInfo: {
    method: String, // e.g., 'credit_card', 'paypal', etc.
    status: String, // e.g., 'completed', 'pending', etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
