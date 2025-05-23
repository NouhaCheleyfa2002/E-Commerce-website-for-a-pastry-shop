import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Adjust the model name if your product model is named differently
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
}, { _id: false }); // Prevent Mongoose from auto-generating _id for each subdoc

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: String,
  country: String,
  address: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: {
    type: String,
    default: "Active",
  },
  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
