import express from "express";
import { getAdmins, getUserPerformance } from "../controllers/management.js"

const managementRoutes = express.Router();

managementRoutes.get("/admins", getAdmins)
managementRoutes.get("/performance/:id", getUserPerformance);

export default managementRoutes;