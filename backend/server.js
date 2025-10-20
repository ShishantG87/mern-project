import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import { connectDB } from  "./config/db.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// CORS middleware
app.use(cors({
    origin: "https://mern-project-frontend-9djz.onrender.com", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/users", authRoutes);

// Connect database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});
