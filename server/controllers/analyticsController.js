import TrafficAnalytics from "../models/trafficAnalyticsModel.js";
import InventoryAnalytics from "../models/inventoryAnalyticsModel.js";
import SalesAnalytics from "../models/salesAnalyticsModel.js";
import UserActivityAnalytics from "../models/UserActivityAnalyticsModel.js";


// Track user activity
export const trackUserActivity = async (req, res) => {
    try {
      const { userId, activityType, description } = req.body;
      const userActivityEntry = new UserActivityAnalytics({
        userId,
        activityType,
        description,
      });
      await userActivityEntry.save();
      res.status(201).json(userActivityEntry);
    } catch (error) {
      res.status(500).json({ error: "Error tracking user activity." });
    }
  };

// Track sales analytics
export const trackSales = async (req, res) => {
  try {
    const {  orderId, productId, amount, date } = req.body;
    const salesEntry = new SalesAnalytics({ type: "sales", orderId, productId, amount, date });
    await salesEntry.save();
    res.status(201).json(salesEntry);
  } catch (error) {
    res.status(500).json({ error: "Error tracking sales." });
  }
};

// Track traffic analytics
export const trackTraffic = async (req, res) => {
  try {
    const { source, timestamp } = req.body;
    const trafficEntry = new TrafficAnalytics({ type: "traffic", source, timestamp });
    await trafficEntry.save();
    res.status(201).json(trafficEntry);
  } catch (error) {
    res.status(500).json({ error: "Error tracking traffic." });
  }
};

// Track inventory analytics
export const trackInventory = async (req, res) => {
  try {
    const { productId, change, reason, timestamp } = req.body;
    const inventoryEntry = new InventoryAnalytics({
      productId,
      change,
      reason,
      timestamp,
    });
    await inventoryEntry.save();
    res.status(201).json(inventoryEntry);
  } catch (error) {
    res.status(500).json({ error: "Error tracking inventory." });
  }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
    try {
      const sales = await SalesAnalytics.find();
      const traffic = await TrafficAnalytics.find();
      const userActivity = await UserActivityAnalytics.find();
      const inventory = await InventoryAnalytics.find();
  
      res.status(200).json({
        sales,
        traffic,
        inventory,
        userActivity,    
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving analytics." });
    }
  };