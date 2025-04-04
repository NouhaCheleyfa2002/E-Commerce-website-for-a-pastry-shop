import express from 'express';
import { trackSales, trackTraffic, trackInventory, trackUserActivity, getAnalytics } from '../controllers/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.post('/sales', trackSales);
analyticsRouter.post('/traffic', trackTraffic);
analyticsRouter.post('/user-activity', trackUserActivity);
analyticsRouter.post('/inventory', trackInventory);
analyticsRouter.post('/analytics', getAnalytics);

export default analyticsRouter;
