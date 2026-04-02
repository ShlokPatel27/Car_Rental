import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.log("❌ MongoDB Error:", err.message);
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4
        });

    } catch (error) {
        console.log("❌ Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;