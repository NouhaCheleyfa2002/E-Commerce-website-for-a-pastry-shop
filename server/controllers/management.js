import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import Transaction from "../models/Transaction.js";
import AffiliateStat from '../models/AffiliateStats.js'; // adjust the path

export const getAdmins = async (req, res) => {
    try{
        const admins = await userModel.find({role: "admin"}).select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


// Make sure to import AffiliateStat at the top of your file
// import AffiliateStat from '../path/to/your/AffiliateStat.js';

// First, let's debug the collection names
export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    // Import your AffiliateStat model
    // import AffiliateStat from '../models/AffiliateStat.js'; // adjust path as needed

    // Debug collection names
    console.log("User collection name:", userModel.collection.name);
    console.log("AffiliateStat collection name:", AffiliateStat.collection.name);
    
    // List all collections to see what actually exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("All collections:", collections.map(c => c.name));

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Check if user exists
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", !!user);

    // Check if affiliate stats exist using the model
    const affiliateStats = await AffiliateStat.findOne({ userId: id });
    console.log("Affiliate stats found:", !!affiliateStats);
    console.log("Affiliate stats data:", affiliateStats);

    // Try aggregation with correct collection name
    const correctCollectionName = AffiliateStat.collection.name;
    
    const userWithStats = await userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: correctCollectionName, // Use the actual collection name
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      {
        $addFields: {
          affiliateStats: {
            $cond: {
              if: { $gt: [{ $size: "$affiliateStats" }, 0] },
              then: { $arrayElemAt: ["$affiliateStats", 0] },
              else: null
            }
          }
        }
      }
    ]);

    console.log("Aggregation result:", userWithStats);

    if (!userWithStats || userWithStats.length === 0) {
      return res.status(404).json({ message: "User not found in aggregation" });
    }

    const userResult = userWithStats[0];
    
    // Handle sales transactions
    let filteredSaleTransactions = [];
    
    if (userResult.affiliateStats && userResult.affiliateStats.affiliateSales && userResult.affiliateStats.affiliateSales.length > 0) {
      const saleTransactions = await Promise.all(
        userResult.affiliateStats.affiliateSales.map(async (transactionId) => {
          try {
            return await Transaction.findById(transactionId);
          } catch (error) {
            console.error(`Error fetching transaction ${transactionId}:`, error);
            return null;
          }
        })
      );

      filteredSaleTransactions = saleTransactions.filter(
        (transaction) => transaction !== null
      );
    }

    res.status(200).json({ 
      user: userResult, 
      sales: filteredSaleTransactions 
    });

  } catch (error) {
    console.error("getUserPerformance error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};