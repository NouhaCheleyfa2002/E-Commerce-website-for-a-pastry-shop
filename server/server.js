import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import productRouter from "./routes/productRoutes.js";
import uploadRouter from './routes/uploadRoutes.js';
import orderRouter from "./routes/orderRoutes.js"; 
import analyticsRouter from './routes/analyticsRoutes.js';
import SalesAnalytics from './models/salesAnalyticsModel.js';
import TrafficAnalytics from './models/trafficAnalyticsModel.js';
import InventoryAnalytics from './models/inventoryAnalyticsModel.js';
import UserActivityAnalytics from './models/UserActivityAnalyticsModel.js';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const startServer = async () => {
    await connectDB();
    
    app.use('/api/user', userRouter);
    app.use("/api/product", productRouter);
    app.use("/api", uploadRouter);
    app.use("/api", orderRouter);
    app.use('/api/analytics', analyticsRouter);

    app.get('/', (req, res) => res.send("API working"));

    // WebSocket events
    io.on("connection", (socket) => {
        console.log("🟢 A client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("🔴 A client disconnected:", socket.id);
        });
    });

    // Watch for changes in the database and emit updates
    const watchCollection = (model, eventName) => {
        model.watch().on("change", (change) => {
            io.emit(eventName, change);
        });
    };

    // Watch analytics collections for changes and push real-time updates
    watchCollection(SalesAnalytics, 'salesUpdate');
    watchCollection(TrafficAnalytics, 'trafficUpdate');
    watchCollection(InventoryAnalytics, 'inventoryUpdate');
    watchCollection(UserActivityAnalytics, 'userActivityUpdate');

    // ✅ Correctly start the server with WebSockets
    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

startServer();
