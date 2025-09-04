import Product from "../models/productModel.js";

// Add multiple products (bulk insert)
import mongoose from "mongoose";


// Add this function to your controller file
export const getAllProducts = async (req, res) => {
  try {
      const products = await Product.find();
      res.status(200).json(products);
  } catch (error) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

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
  

export const createProduct = async (req, res) => {
    try {
        console.log("=== CREATE PRODUCT START ===");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        // Handle ingredients
        let ingredients = req.body.ingredients;
        if (typeof ingredients === "string") {
            ingredients = ingredients.split(",").map(i => i.trim());
        }

        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            stock: Number(req.body.stock),
            ingredients: ingredients || [],
            isTrending: req.body.isTrending === 'true' || req.body.isTrending === true,
        };

        // Handle image - Cloudinary integration
        if (req.file) {
            // If image uploaded via multer/cloudinary directly, use the cloudinary URL
            productData.image = req.file.path; // Cloudinary URL
        } else if (req.body.image) {
            // If image was uploaded separately and URL is provided in body.image
            productData.image = req.body.image;
        } else {
            // No image provided - set to null or undefined to make it optional
            // Don't set a default here, let the schema handle it
        } 
        console.log("Product data to save:", productData);

        // Create a new Product instance with the productData
        const product = new Product(productData);
        
        // Save the product to the database
        const savedProduct = await product.save();
        
        console.log("Product saved successfully:", savedProduct);
        console.log("=== CREATE PRODUCT END ===");
        
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("=== CREATE PRODUCT ERROR ===");
        console.error("Error details:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        res.status(500).json({ 
            error: "Failed to create product", 
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

  
  export const updateProduct = async (req, res) => {
    try {
      console.log("=== UPDATE PRODUCT START ===");
      console.log("Product ID:", req.params.id);
      console.log("Update request body:", req.body);
      console.log("Update request file:", req.file);
      
      // Build update object from req.body
      const updatedFields = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        ingredients: req.body.ingredients,
        isTrending: req.body.isTrending,          
      };
  
      // Handle image field properly
      if (req.file) {
        // New file uploaded
        updatedFields.image = `/upload/${req.file.filename}`;
      } else if (req.body.image && req.body.image.trim()) {
        // Existing image URL provided
        updatedFields.image = req.body.image;
      }
      // If neither req.file nor req.body.image, the image field won't be updated
  
      console.log("Final updatedFields:", updatedFields);
  
      // Find the product first to see current state
      const currentProduct = await Product.findById(req.params.id);
      console.log("Current product before update:", currentProduct);
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      console.log("Updated product from DB:", updatedProduct);
      console.log("=== UPDATE PRODUCT END ===");
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
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

// Fetch products by category name
export const getProductsByCategory = async (req, res) => {
    const { categoryName } = req.params;
  
    try {
      const products = await Product.find({ category: categoryName }); 
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching products" });
    }
  };
  
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
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
