import productModel from "../models/productModel.js"
import ProductStat from "../models/ProductStats.js"
import userModel from "../models/userModel.js";
import Transaction from "../models/Transaction.js"
import getCountryIso3 from "country-iso-2-to-3"

export const getProducts = async (req, res) => {
    try {
      const products = await productModel.find();
      
      const productsWithStats = await Promise.all(
        products.map(async (product) => {
            const stat = await ProductStat.find({
                productId: product._id
            })
            return {
                ...product._doc,
                stat,
            }
        })
      );
      res.status(200).json(productsWithStats);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  export const getCustomers = async(req, res) => {
    try {
      const customers = await userModel.find({role: "user"}).select("-password");
      res.status(200).json(customers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
  

  export const getTransactions = async(req, res) => {
    try {
      //sort should look like this: {"field", "userId", "sort", "desc"}
      const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
  
      //formatted sort should look like {userId: -1}
      const generateSort = () => {
        const sortParsed = JSON.parse(sort);
        const sortFormatted = {
          [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1
        }; 
        return sortFormatted; 
      }
      const sortFormatted = Boolean(sort) ? generateSort() : {};
  
      // Build search query based on search input
      let searchQuery = {};
      
      if (search && search.trim() !== "") {
        const searchConditions = [];
        
        // Search in string fields using regex
        searchConditions.push({ name: { $regex: new RegExp(search, "i") } });
        
        // If search is a number, search for exact matches in numeric fields
        if (!isNaN(search)) {
          const numericSearch = Number(search);
          searchConditions.push({ cost: numericSearch });
          searchConditions.push({ userId: numericSearch });
        }
        
        searchQuery = { $or: searchConditions };
      }
  
      const transactions = await Transaction.find(searchQuery)
        .sort(sortFormatted)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      const total = await Transaction.countDocuments(searchQuery);
  
      res.status(200).json({
        transactions,
        total,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
    

export const getGeography = async (req, res) => {
  try {
    const users = await userModel.find();
      
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3   = getCountryIso3(country);
      console.log("testing:", countryISO3);
      
      if (!acc[countryISO3]){
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count}
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}