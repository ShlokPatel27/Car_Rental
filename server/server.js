import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});
app.use('/api/user', userRouter)   // Aa mari API Endpoint che
app.use('/api/owner', ownerRouter)   // Any user can become a car owner
app.use('/api/bookings', bookingRouter)   

// Start Server Function (better structure)
const startServer = async () => {
    try {
        // Connect Database
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("❌ Server Failed to Start:", error.message);
    }
};

startServer();