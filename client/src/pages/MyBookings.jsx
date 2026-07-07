import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { useLocation } from 'react-router-dom'

const MyBookings = () => {

  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState({}) // { bookingId: reviewObj }
  const [reviewForm, setReviewForm] = useState({ bookingId: null, rating: 5, text: '' })
  const { axios, currency, token } = useAppContext()

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')

      if (data.success) {
        setBookings(data.bookings)
        // Fetch reviews for each Paid booking
        data.bookings.forEach(booking => {
            if (booking.paymentStatus === 'Paid') {
                fetchBookingReview(booking._id)
            }
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchBookingReview = async (bookingId) => {
      try {
          const { data } = await axios.get(`/api/reviews/booking/${bookingId}`)
          if (data.success && data.review) {
              setReviews(prev => ({ ...prev, [bookingId]: data.review }))
          }
      } catch (error) {
          console.error(error)
      }
  }

  const location = useLocation()

  useEffect(() => {
    if (token) {
        fetchMyBookings()
    }
  }, [token])

  useEffect(() => {
      const queryParams = new URLSearchParams(location.search)
      const sessionId = queryParams.get('session_id')
      if (sessionId && token) {
          verifyPayment(sessionId)
      }
  }, [location.search, token])

  const verifyPayment = async (sessionId) => {
      try {
          const { data } = await axios.post('/api/payment/verify', { session_id: sessionId })
          if (data.success) {
              toast.success("Payment Successful!")
              // Remove query params from url
              window.history.replaceState(null, '', window.location.pathname)
              fetchMyBookings()
          }
      } catch (error) {
          console.error(error)
      }
  }

  const handlePayment = async (bookingId) => {
      try {
          const { data } = await axios.post('/api/payment/create-checkout-session', { bookingId })
          if (data.success && data.url) {
              window.location.href = data.url
          } else {
              toast.error(data.message || 'Failed to initiate payment')
          }
      } catch (error) {
          toast.error(error.response?.data?.message || error.message)
      }
  }

  const submitReview = async (bookingId, carId) => {
      try {
          if (!reviewForm.text) return toast.error("Please enter a review")
          const { data } = await axios.post('/api/reviews/add', {
              booking: bookingId,
              car: carId,
              rating: reviewForm.rating,
              reviewText: reviewForm.text
          })
          if (data.success) {
              toast.success("Review added successfully!")
              setReviewForm({ bookingId: null, rating: 5, text: '' })
              fetchBookingReview(bookingId)
          } else {
              toast.error(data.message)
          }
      } catch (error) {
          toast.error(error.response?.data?.message || error.message)
      }
  }

  return (
    <motion.div 
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6}}

    className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl'>
      <Title 
        title='My Bookings'
        subTitle='View your car bookings'
        align="left"
      />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay:index*0.1}} 
            key={booking._id} 
            className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border rounded-lg mt-5 min-h-[220px]'
          >

            {/* Car Info */}
            <div className='flex flex-col justify-center h-full'>
              <img 
                src={booking.car?.image} 
                className='rounded mb-2 w-full h-[140px] object-cover'
              />
              <p className='font-semibold'>
                {booking.car?.brand} {booking.car?.model}
              </p>
              <p className='text-gray-500 text-sm'>
                {booking.car?.location}
              </p>
            </div>

            {/* Booking Status & Details */}
            <div className='md:col-span-2 flex flex-col justify-start'>
              <p className='text-sm text-gray-500'>Booking #{index + 1}</p>

              <p className='mt-2'>
                {booking.pickupDate?.split('T')[0]} → {booking.returnDate?.split('T')[0]}
              </p>

              <div className='mt-2'>
                Status:
                <span className={`ml-2 font-semibold capitalize ${
                  booking.status === 'confirmed'
                    ? 'text-green-600'
                    : booking.status === 'cancelled'
                    ? 'text-red-600'
                    : 'text-orange-500'
                }`}>
                  {booking.status}
                </span>
                
                {/* Status custom text */}
                <p className='mt-1 text-sm font-medium'>
                    {booking.status === 'pending' && <span className="text-orange-500">Waiting for the Owner to Confirm</span>}
                    {booking.status === 'cancelled' && <span className="text-red-600">Booking Cancelled by Owner</span>}
                    {booking.status === 'confirmed' && <span className="text-green-600">Booking Confirmed</span>}
                </p>
              </div>

              {/* Review Section */}
              {reviews[booking._id] && (
                  <div className='mt-4 p-3 border border-green-500 rounded bg-green-50 max-w-sm'>
                      <p className='font-semibold text-green-700 text-xs mb-1'>Your Review</p>
                      <div className='flex items-center text-blue-500 text-xs mb-1'>
                          {'★'.repeat(reviews[booking._id].rating)}{'☆'.repeat(5 - reviews[booking._id].rating)}
                      </div>
                      <p className='text-gray-700 text-sm'>{reviews[booking._id].reviewText}</p>
                  </div>
              )}

              {/* Review Form */}
              {reviewForm.bookingId === booking._id && !reviews[booking._id] && (
                  <div className='mt-4 p-4 border rounded shadow-sm bg-gray-50 max-w-sm'>
                      <p className='font-semibold mb-2'>Leave a Review</p>
                      <div className='flex gap-1 mb-3 cursor-pointer text-xl'>
                          {[1, 2, 3, 4, 5].map(star => (
                              <span 
                                key={star} 
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className={star <= reviewForm.rating ? 'text-blue-500' : 'text-gray-300'}
                              >
                                  ★
                              </span>
                          ))}
                      </div>
                      <textarea 
                          className='w-full border p-2 rounded text-sm mb-2 focus:outline-none focus:border-blue-500' 
                          placeholder='Write your experience...'
                          rows={3}
                          value={reviewForm.text}
                          onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      ></textarea>
                      <button 
                          onClick={() => submitReview(booking._id, booking.car._id)}
                          className='bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 w-full'
                      >
                          Submit Review
                      </button>
                  </div>
              )}
            </div>

            {/* Total and Actions */}
            <div className='flex flex-col justify-start items-start md:items-end md:text-right'>
              <div className='mb-4'>
                  <p className='text-gray-500'>Total</p>
                  <h2 className='text-xl font-bold'>
                    {currency}{booking.price}
                  </h2>
              </div>

              {booking.status === 'confirmed' && booking.paymentStatus === 'Pending' && (
                  <button 
                    onClick={() => handlePayment(booking._id)}
                    className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto'
                  >
                      Proceed To Payment
                  </button>
              )}

              {booking.paymentStatus === 'Paid' && !reviews[booking._id] && reviewForm.bookingId !== booking._id && (
                  <button 
                    onClick={() => setReviewForm({ ...reviewForm, bookingId: booking._id })}
                    className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2 w-full md:w-auto'
                  >
                      Rating and Review
                  </button>
              )}
              
              {booking.paymentStatus === 'Paid' && (
                  <p className='text-green-600 font-semibold mt-2 text-sm'>Payment Successful</p>
              )}
            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default MyBookings