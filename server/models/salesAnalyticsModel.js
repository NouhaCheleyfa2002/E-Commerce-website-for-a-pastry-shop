import mongoose from 'mongoose';

const salesAnalyticsSchema = new mongoose.Schema({
    orderId: String,
    productId: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const SalesAnalytics = mongoose.model('SalesAnalytics', salesAnalyticsSchema);

export default SalesAnalytics;