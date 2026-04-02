import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const checkBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status
      })

      if (data.success) {
        toast.success("Status Updated")
        fetchOwnerBookings() // ✅ FIXED
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title 
        title="Manage Bookings" 
        subTitle="Track all customer bookings and manage status." 
      />

      <div className='max-w-3xl w-full border mt-6 rounded-lg overflow-hidden'>

        <table className='w-full text-left text-sm text-gray-600'>
          <thead className='bg-gray-50'>
            <tr>
              <th className="p-3">Car</th>
              <th className="p-3 max-md:hidden">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className='border-t'>

                {/* Car */}
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car?.image} className='h-12 w-12 rounded object-cover' />
                  <p>{booking.car?.brand} {booking.car?.model}</p>
                </td>

                {/* Date */}
                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} → {booking.returnDate.split('T')[0]}
                </td>

                {/* Price */}
                <td className='p-3'>
                  {currency}{booking.price}
                </td>

                {/* Status Dropdown */}
                <td className='p-3'>
                  <select
                    value={booking.status}
                    onChange={(e) => checkBookingStatus(booking._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-md border outline-none ${
                      booking.status === 'confirmed'
                        ? 'text-green-600 border-green-300 bg-green-50'
                        : booking.status === 'cancelled'
                        ? 'text-red-600 border-red-300 bg-red-50'
                        : 'text-orange-500 border-orange-300 bg-orange-50'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  )
}

export default ManageBookings