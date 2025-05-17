import userModel from "../models/userModel.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { date } = req.query; // dynamic date passed as query param

    const targetDate = date ? new Date(date) : new Date(); // fallback to today if not provided

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.toLocaleString("default", { month: "long" }); // e.g. "May"
    const targetDay = targetDate.toISOString().split("T")[0]; // e.g. "2025-05-14"

    const transactions = await Transaction.find().limit(50).sort({ createdOn: -1 });

    const overallStat = await OverallStat.findOne({ year: targetYear });

    if (!overallStat) {
      return res.status(404).json({ message: `No stats found for year ${targetYear}` });
    }

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      dailyData
    } = overallStat;

    const thisMonthStats = monthlyData?.find(({ month }) => month === targetMonth);
    const thisDayStats = dailyData?.find(({ date }) => date === targetDay);

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats: thisDayStats, // still returning it as todayStats for compatibility
      transactions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  