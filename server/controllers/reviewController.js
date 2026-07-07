import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export const addReview = async (req, res) => {
    try {
        const { car, booking, rating, reviewText } = req.body;
        const user = req.user._id;

        // Verify booking belongs to user and is Paid
        const existingBooking = await Booking.findOne({ _id: booking, user });
        if (!existingBooking) {
            return res.status(404).json({ success: false, message: "Booking not found or not yours" });
        }
        if (existingBooking.paymentStatus !== "Paid") {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ booking });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "Review already submitted for this booking" });
        }

        const review = new Review({
            car,
            user,
            booking,
            rating,
            reviewText
        });

        await review.save();

        res.status(201).json({ success: true, message: "Review added successfully", review });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;
        const reviews = await Review.find({ car: carId }).populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookingReview = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const review = await Review.findOne({ booking: bookingId }).populate('user', 'name');
        res.status(200).json({ success: true, review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
