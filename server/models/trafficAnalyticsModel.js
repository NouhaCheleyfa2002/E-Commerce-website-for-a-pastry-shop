import mongoose from 'mongoose';


const trafficAnalyticsSchema = new mongoose.Schema({
    userId: String,
    pageVisited: String,
    referralSource: String,
    timestamp: { type: Date, default: Date.now }
});

const TrafficAnalytics = mongoose.model('TrafficAnalytics', trafficAnalyticsSchema);

export default TrafficAnalytics;