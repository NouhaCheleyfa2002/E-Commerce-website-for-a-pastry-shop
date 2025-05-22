import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cart.js";
import { userAuth } from "../middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.get("/", userAuth, getCart);
cartRouter.post("/add", userAuth, addToCart);
cartRouter.put("/update", userAuth, updateCartItem);
cartRouter.delete("/remove", userAuth, removeFromCart);
cartRouter.delete("/clear", userAuth, clearCart);

export default cartRouter;
