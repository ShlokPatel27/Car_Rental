import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        // Extract token properly
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Not authorized" });
        }

        const token = authHeader.split(" ")[1];

        // Verify token (NOT decode)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from DB
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Attach user
        req.user = user;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        return res.json({ success: false, message: "Invalid token" });
    }
};