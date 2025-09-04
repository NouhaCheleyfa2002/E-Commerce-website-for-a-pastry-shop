import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: false }, // URL of the image
    ingredients: [{ type: String }],
    isTrending: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    
});

const Product = mongoose.model("Product", productSchema);

export default Product;
