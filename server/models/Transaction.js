import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to User model
    required: true 
  },
  name:{ type: String, required: true },
  cost: { type: String, required: true },
  products: {
    type: [mongoose.Types.ObjectId],
    of: Number
  }
}, {timestamps: true});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction;