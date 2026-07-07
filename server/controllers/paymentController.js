import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('car');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({ success: false, message: "Booking is not confirmed yet." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${booking.car.brand} ${booking.car.model}`,
                            description: `Rental from ${booking.pickupDate.toISOString().split('T')[0]} to ${booking.returnDate.toISOString().split('T')[0]}`
                        },
                        unit_amount: booking.price * 100, // Stripe expects amount in cents/paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/my-bookings?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/my-bookings?canceled=true`,
            metadata: {
                bookingId: booking._id.toString(),
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            const bookingId = session.metadata.bookingId;
            await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'Paid' });
            return res.status(200).json({ success: true, message: "Payment verified and updated" });
        } else {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
            case 'checkout.session.completed':
                {
                    // If we use checkout.session.completed we get metadata directly
                    const session = event.data.object;
                    if (session.metadata && session.metadata.bookingId) {
                        await Booking.findByIdAndUpdate(session.metadata.bookingId, { paymentStatus: 'Paid' });
                    } else if (event.type === 'payment_intent.succeeded') {
                         // Fallback for payment intent if metadata was passed differently
                         // Note: with standard checkout, metadata is on session, not necessarily intent unless copied
                    }
                }
                break;
            case 'payment_intent.payment_failed':
            case 'payment_intent.canceled':
                 // This might not easily map to booking without metadata, but we'll handle if available
                 break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook Handler Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
