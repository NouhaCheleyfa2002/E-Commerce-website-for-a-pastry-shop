import express from 'express';
import { registerUser, loginUser,getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
    createOrUpdateUser } from '../controllers/userController.js';
import { userAuth, adminAuth } from '../middlewares/auth.js';

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected User Route
userRouter.get('/profile', userAuth, (req, res) => {
    res.json({ success: true, message: 'User Profile Accessed', userId: req.body.userId, role: req.body.role });
});

// Admin-only Route

//userRouter.get('/admin-dashboard', userAuth, adminAuth, (req, res) => {
 //   res.json({ success: true, message: 'Welcome to Admin Dashboard' });
//});

// Routes for managing users
userRouter.get("/", getAllUsers); // Get all users
userRouter.get("/:id", getUserById); // Get a single user by ID
userRouter.put("/:id/status", updateUserStatus); // Update user status
userRouter.delete("/:id", deleteUser); // Delete a user
userRouter.post("/:id?", createOrUpdateUser);
;

export default userRouter;
