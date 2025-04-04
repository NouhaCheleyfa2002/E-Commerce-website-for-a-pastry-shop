import express from 'express';
import { upload } from "../config/cloudinaryConfig.js";
const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    res.json({ imageUrl: req.file.path }); // Cloudinary URL response
});

export default uploadRouter;
