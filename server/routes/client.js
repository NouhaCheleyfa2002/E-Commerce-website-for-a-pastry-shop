import express from "express";
import { getProducts, getCustomers, getTransactions, getGeography} from "../controllers/client.js";

const clientRoutes = express.Router();

clientRoutes.get("/products", getProducts);
clientRoutes.get("/customers", getCustomers);
clientRoutes.get("/transactions", getTransactions);
clientRoutes.get("/geography", getGeography);

export default clientRoutes;