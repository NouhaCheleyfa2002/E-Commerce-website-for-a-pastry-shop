import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing details' });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const newUser = new userModel({ name, email, password: hashedPassword, role: role || 'user'});
        const user = await newUser.save();

        if (!user) {
            return res.status(500).json({ success: false, message: 'User registration failed' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role:  user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, token, user: { name: user.name,role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`); // Debugging log

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT with role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, user: { name: user.name, role: user.role } });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
     const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  };
  
  // Get a single user by ID
  export const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.findById(userId); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  };
  
  // Update user status
  export const updateUserStatus = async (req, res) => {
    const userId = req.params.id;
    const { status } = req.body; // Expecting status in the request body
  
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      ); // Update status and return the updated user
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Error updating user status" });
    }
  };
  
  // Delete user
  export const deleteUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId); // Delete the user by ID
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  };
  
  // Create or update a user (for editing)
  export const createOrUpdateUser = async (req, res) => {
    const { name, email, status, role } = req.body;
    const userId = req.params.id;
  
    try {
      let user;
      if (userId) {
        // Update user
        user = await userModel.findByIdAndUpdate(
          userId,
          { name, email, status, role },
          { new: true }
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      } else {
        // Create new user
        user = new user({ name, email, status, role });
        await user.save();
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error creating or updating user:", error);
      res.status(500).json({ message: "Error creating or updating user" });
    }
  };



