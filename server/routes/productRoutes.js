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

productRouter.put("/:id", updateProduct);

// Delete a product
productRouter.delete("/:id", deleteProduct);

export default productRouter;
