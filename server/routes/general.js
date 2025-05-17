import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const generalRoutes = express.Router();

generalRoutes.get("/user/:id", getUser);
generalRoutes.get("/dashboard", getDashboardStats);

export default generalRoutes;