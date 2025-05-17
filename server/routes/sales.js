import express from "express";
import { getSales } from "../controllers/sales.js"

const salesRoutes = express.Router();

salesRoutes.get('/sales', getSales);

export default salesRoutes;