import express from "express";
import {
    bulkInsertProducts,
    getAllProducts,
    getTrendingProducts,
    getProductById,   
    getProductsByCategory,
    deleteProduct,
    updateProduct
} from "../controllers/productController.js";
import Product from "../models/productModel.js";

const productRouter = express.Router();

// Bulk insert products
productRouter.post("/bulk-insert", bulkInsertProducts);

// Get all products
productRouter.get("/", getAllProducts);

// Route to fetch trending products
productRouter.get("/trending", getTrendingProducts);

// Get product by ID
productRouter.get("/:id", getProductById);


// Get products by category
productRouter.get("/category/:categoryName", getProductsByCategory);

// Get all distinct product categories
productRouter.get("/categories", async (req, res) => {
    try {
      const categories = await Product.distinct("category");
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch categories", error: err.message });
    }
  });

productRouter.put("/:id", updateProduct);

// Delete a product
productRouter.delete("/:id", deleteProduct);

export default productRouter;
