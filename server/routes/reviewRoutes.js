import express from 'express';
import { addReview, getCarReviews, getBookingReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', protect, addReview);
reviewRouter.get('/car/:carId', getCarReviews);
reviewRouter.get('/booking/:bookingId', protect, getBookingReview);

export default reviewRouter;
