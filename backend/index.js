import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoute.js"
import courseRoutes from "./routes/courseRoute.js"
import mediaRoutes from "./routes/mediaRoute.js";
import coursePurchaseRoutes from "./routes/coursePurchaseRoute.js" 
import courseProgressRoutes from "./routes/courseProgressRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Middleware
app.use(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" }) // Raw body for Stripe webhook
);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/user",userRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/purchase", coursePurchaseRoutes);
app.use("/api/v1/progress", courseProgressRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
