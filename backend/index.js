import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoute.js"
import courseRoutes from "./routes/courseRoute.js"
import mediaRoutes from "./routes/mediaRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/user",userRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/media", mediaRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
