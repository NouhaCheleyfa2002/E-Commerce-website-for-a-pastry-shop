import mongoose from "mongoose";

const inventoryAnalyticsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  change: { type: Number, required: true }, // Positive for addition, negative for removal
  reason: { type: String, enum: ["restock", "sale", "damage", "return"], required: true },
  timestamp: { type: Date, default: Date.now }
});

const InventoryAnalytics = mongoose.model("InventoryAnalytics", inventoryAnalyticsSchema);

export default InventoryAnalytics;