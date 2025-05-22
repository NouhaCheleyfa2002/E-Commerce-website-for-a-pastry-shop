import userModel from "../models/userModel.js";

export const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("cart.productId");
    res.json({ success: true, cartItems: user.cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const user = await userModel.findById(req.user.id);

    const existingItem = user.cart.find(item =>
      item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json({ success: true, cartItems: user.cart });

  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await userModel.findById(req.user.id);

    const item = user.cart.find(item =>
      item.productId.toString() === productId
    );

    if (item) {
      item.quantity = Math.max(1, quantity);
      await user.save();
      res.json({ success: true, cartItems: user.cart });

    } else {
      res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await userModel.findById(req.user.id);
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    res.json({ success: true, cartItems: user.cart });

  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
