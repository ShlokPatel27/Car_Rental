import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {

  const [bookings, setBookings] = useState([])
  const { axios, currency, token } = useAppContext()

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')

      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchMyBookings()
  }, [token])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl'>
      <Title 
        title='My Bookings'
        subTitle='View your car bookings'
        align="left"
      />

      <div>
        {bookings.map((booking, index) => (
          <div 
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

            {/* ✅ Booking Info (TOP ALIGNED NOW) */}
            <div className='md:col-span-2 flex flex-col justify-start'>
              <p className='text-sm text-gray-500'>Booking #{index + 1}</p>

              <p className='mt-2'>
                {booking.pickupDate?.split('T')[0]} → {booking.returnDate?.split('T')[0]}
              </p>

              <p className='mt-2'>
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
              </p>
            </div>

            {/* Total (already top aligned) */}
            <div className='flex flex-col justify-start'>
              <p className='text-gray-500'>Total</p>
              <h2 className='text-xl font-bold'>
                {currency}{booking.price}
              </h2>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings