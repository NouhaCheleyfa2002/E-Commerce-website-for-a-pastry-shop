import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true }, // e.g., "viewed_product", "added_to_cart", etc.
    description: { type: String }, // Optional, more details on the activity
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserActivityAnalytics = mongoose.model('UserActivityAnalytics', userActivitySchema);

export default UserActivityAnalytics;
