import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car }) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    return (
        <div 
            onClick={() => { navigate(`/car-details/${car._id}`); window.scrollTo(0, 0) }} 
            className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-white'
        >
            
            {/* Image Section */}
            <div className='relative h-56 overflow-hidden'>
                <img 
                    src={car.image} 
                    alt="Car Image" 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                />

                {/* Updated "Available Now" Badge with Blue Color */}
                {car.isAvaliable && (
                    <p className='absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg'>
                        Available Now
                    </p>
                )}

                <div className='absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20'>
                    <span className='font-bold'>{currency}{car.pricePerDay}</span>
                    <span className='text-xs text-white/80'> / day</span>
                </div>
            </div>

            {/* Details Section */}
            <div className='p-5'>
                <div className='mb-4'>
                    <h3 className='text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors'>{car.brand} {car.model}</h3>
                    <p className='text-gray-500 text-sm mt-1'>{car.category} • {car.year}</p>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-50'>
                    <div className='flex items-center text-sm text-gray-600'>
                        <img src={assets.users_icon} alt="" className='h-4 mr-2 opacity-70' />
                        <span>{car.seating_capacity} Seats</span>
                    </div>

                    <div className='flex items-center text-sm text-gray-600'>
                        <img src={assets.fuel_icon} alt="" className='h-4 mr-2 opacity-70' />
                        <span>{car.fuel_type}</span>
                    </div>

                    <div className='flex items-center text-sm text-gray-600'>
                        <img src={assets.car_icon} alt="" className='h-4 mr-2 opacity-70' />
                        <span>{car.transmission}</span>
                    </div>

                    <div className='flex items-center text-sm text-gray-600'>
                        <img src={assets.location_icon} alt="" className='h-4 mr-2 opacity-70' />
                        <span>{car.location}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarCard