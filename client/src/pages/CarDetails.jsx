import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        cars,
        currency,
        axios,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        token
    } = useAppContext()

    const [car, setCar] = useState(null)

    // ✅ Safe car loading
    useEffect(() => {
        if (!cars || cars.length === 0) return

        const foundCar = cars.find(c => String(c._id) === String(id))

        if (!foundCar) {
            console.warn("Car not found:", id)
            return
        }

        setCar(foundCar)
    }, [id, cars])

    // ✅ Booking handler (FIXED)
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!token) {
            toast.error("Please login first")
            return
        }

        if (!pickupDate || !returnDate) {
            toast.error("Please select both dates")
            return
        }

        try {
            const { data } = await axios.post('/api/bookings/create', {
                car: id,   // ✅ FIXED (IMPORTANT)
                pickupDate,
                returnDate
            })

            if (data.success) {
                toast.success(data.message || "Booking Created Successfully")
                navigate('/my-bookings')
            } else {
                toast.error(data.message || "Booking failed")
            }

        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // ✅ Prevent crash
    if (!car || !car.pricePerDay) {
        return <Loader />
    }

    return (
        <div className='px-6 md:px-12 lg:px-20 mt-12 mb-20 max-w-7xl mx-auto'>

            <button
                onClick={() => navigate(-1)}
                className='flex items-center gap-2 mb-8 text-gray-500 hover:text-blue-600 font-medium'
            >
                <img src={assets.arrow_icon} alt="" className='rotate-180 w-4 opacity-70' />
                Back to all cars
            </button>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>

                {/* LEFT */}
                <div className='lg:col-span-2'>

                    <div className='overflow-hidden rounded-2xl shadow-lg mb-8'>
                        <img
                            src={car.image}
                            alt={`${car.brand} ${car.model}`}
                            className='w-full max-h-[500px] object-cover'
                        />
                    </div>

                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-4xl font-bold'>
                                {car.brand} {car.model}
                            </h1>
                            <p className='text-gray-500 mt-1'>
                                {car.category} • {car.year}
                            </p>
                        </div>

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                            {[
                                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                                { icon: assets.fuel_icon, text: car.fuel_type },
                                { icon: assets.car_icon, text: car.transmission },
                                { icon: assets.location_icon, text: car.location },
                            ].map(({ icon, text }, idx) => (
                                <div key={idx} className='flex flex-col items-center bg-gray-50 py-4 rounded-xl'>
                                    <img src={icon} alt="" className='h-5 mb-2' />
                                    <span className='text-sm'>{text}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className='text-xl font-bold mb-2'>Description</h2>
                            <p className='text-gray-600'>{car.description}</p>
                        </div>

                        <div>
                            <h2 className='text-xl font-bold mb-2'>Key Features</h2>
                            <ul className='grid grid-cols-2 gap-2'>
                                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map(item => (
                                    <li key={item} className='flex items-center text-gray-600'>
                                        <img src={assets.check_icon} className='h-4 mr-2' />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div>
                    <form
                        onSubmit={handleSubmit}
                        className='shadow-xl sticky top-24 rounded-2xl p-6 space-y-5 bg-white'
                    >
                        <div className='text-3xl font-bold'>
                            {currency}{car.pricePerDay}
                            <span className='text-gray-400 text-base'> / day</span>
                        </div>

                        <div>
                            <label className='text-sm font-semibold'>Pickup Date</label>
                            <input
                                type="date"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className='w-full border p-3 rounded-lg mt-1'
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className='text-sm font-semibold'>Return Date</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                className='w-full border p-3 rounded-lg mt-1'
                                required
                                min={pickupDate || new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <button
                            type="submit"
                            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700'
                        >
                            Confirm Booking
                        </button>

                        <p className='text-xs text-center text-gray-400'>
                            No hidden fees. Free cancellation.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CarDetails