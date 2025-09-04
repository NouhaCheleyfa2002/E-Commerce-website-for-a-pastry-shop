import express from "express";
import {
    getAllProducts,
    createProduct,
    bulkInsertProducts,
    getTrendingProducts,
    getProductById,   
    getProductsByCategory,
    deleteProduct,
    updateProduct,
    getCategories
} from "../controllers/productController.js";
import { upload } from "../config/cloudinaryConfig.js"; 


const productRouter = express.Router();

productRouter.get('/', getAllProducts); 

productRouter.post("/",  upload.single("image"), createProduct);

// Bulk insert products
productRouter.post("/bulk-insert", bulkInsertProducts);


// Route to fetch trending products
productRouter.get("/trending", getTrendingProducts);

productRouter.get('/categories', getCategories);

// Get products by category
productRouter.get("/category/:categoryName", getProductsByCategory);

// Get product by ID
productRouter.get("/:id", getProductById);


productRouter.put('/:id',upload.single("image"), updateProduct);

// Delete a product
productRouter.delete("/:id", deleteProduct);

export default productRouter;
