import userModel from "../models/userModel.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('wishlist.productId');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error("Error in getWishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await userModel.findById(req.user.id);

    const alreadyExists = user.wishlist.some(item =>
      item.productId.toString() === productId
    );

    if (!alreadyExists) {
      user.wishlist.push({ productId });
      await user.save();
    }

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await userModel.findById(req.user.id);

    user.wishlist = user.wishlist.filter(item =>
      item.productId.toString() !== productId
    );

    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};
