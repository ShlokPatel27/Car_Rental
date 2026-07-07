import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import { stripeWebhook } from "./controllers/paymentController.js";

// Initialize Express App
const app = express();

// Middleware
app.use(cors());

// Webhook route must be before express.json()
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), stripeWebhook);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});
app.use('/api/user', userRouter)   // Aa mari API Endpoint che
app.use('/api/owner', ownerRouter)   // Any user can become a car owner
app.use('/api/bookings', bookingRouter)   
app.use('/api/payment', paymentRouter)
app.use('/api/reviews', reviewRouter)

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