import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import productRouter from "./routes/productRoutes.js";
import uploadRouter from './routes/uploadRoutes.js';
import orderRouter from "./routes/orderRoutes.js"; 
import generalRoutes from './routes/general.js';
import clientRoutes from './routes/client.js';
import managementRoutes from './routes/management.js';
import salesRoutes from './routes/sales.js';
import cartRouter from './routes/cart.js';
import wishlistRouter from './routes/wishlist.js';
import newsletterRouter from './routes/newsletterRoutes.js';



const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


    await connectDB();
    

    app.use('/api/user', userRouter);
    app.use("/api/product", productRouter);
    app.use("/api", uploadRouter);
    app.use("/api", orderRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/wishlist", wishlistRouter);
    app.use('/api/newsletter', newsletterRouter);

    //app.get('api/config/paypal', (req, res)=> res.send(process.env.PAYPAL_CLIENT_ID))

    app.use("/api/client", clientRoutes);
    app.use("/api/general", generalRoutes);
    app.use("/api/management", managementRoutes);
    app.use("/api/sales", salesRoutes); 
   

    app.get('/', (req, res) => res.send("API working"));



   app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

