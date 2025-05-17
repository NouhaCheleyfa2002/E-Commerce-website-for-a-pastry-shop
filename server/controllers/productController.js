import Product from "../models/productModel.js";

// Add multiple products (bulk insert)
import mongoose from "mongoose";

export const bulkInsertProducts = async (req, res) => {
    try {
        const newProducts = req.body.map(product => ({
            ...product,
            _id: product._id ? new mongoose.Types.ObjectId.createFromTime(product._id.getTime()) : new mongoose.Types.ObjectId(),
        }));

        const products = await Product.insertMany(newProducts);
        res.status(201).json({ message: "Products added successfully!", products });
    } catch (error) {
        res.status(500).json({ message: "Error adding products", error });
    }
};


// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Updating Product ID:", id); // Debugging log

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product", error });
    }
};


// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch products by category
export const getProductsByCategory = async (req, res) => {
    const { categoryName } = req.params;
  
    try {
      const products = await Product.find({ category: categoryName }); // Assuming your Product schema has a 'category' field
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching products" });
    }
  };


  
// Fetch Trending Products
export const getTrendingProducts = async (req, res) => {
    try {
        const trendingProducts = await Product.find({ isTrending: true });

        if (!trendingProducts.length) {
            return res.status(404).json({ message: "No trending products found." });
        }

        res.status(200).json(trendingProducts);
    } catch (error) {
        console.error("Error fetching trending products:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
