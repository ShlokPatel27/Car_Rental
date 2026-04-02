import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Hero = () => {
    // 1. Manually change your locations in this array
    const locations = ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara', 'Gandhinagar']

    const [pickupLocation, setPickupLocation] = useState('')
    
    // Fixed: Added () to call the hook
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

    const handleSearch = (e) => {
        e.preventDefault()
        // Fixed: Added missing '+' and '&' in the template string
        navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate)
    }

    return (
        <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center px-4'>

            <h1 className='text-4xl md:text-5xl font-semibold'>Luxury cars on Rent</h1>

            {/* Main Form Container */}
            <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-center justify-between p-4 md:p-2 rounded-3xl md:rounded-full w-full max-w-lg md:max-w-4xl bg-white shadow-lg border border-gray-100'>

                <div className='flex flex-col md:flex-row items-center gap-8 md:gap-12 flex-grow px-6 py-4'>
                    
                    {/* Pickup Location Selection */}
                    <div className='flex flex-col items-start gap-1'>
                        <label className='text-base font-bold'>Pickup Location</label>
                        <select 
                            className='outline-none bg-transparent cursor-pointer text-gray-600'
                            required 
                            value={pickupLocation} 
                            onChange={(e) => setPickupLocation(e.target.value)}
                        >
                            <option value="">Select Location</option>
                            {locations.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <p className='text-[10px] text-gray-400'>
                            {pickupLocation ? `Selected: ${pickupLocation}` : 'Please select location'}
                        </p>
                    </div>

                    {/* Pick-up Date */}
                    <div className='flex flex-col items-start gap-1 border-gray-200 md:border-l md:pl-8'>
                        <label className='text-base font-bold' htmlFor='pickup-date'>Pick-up Date</label>
                        <input 
                            value={pickupDate} 
                            onChange={e => setPickupDate(e.target.value)}
                            type="date" 
                            id="pickup-date" 
                            min={new Date().toISOString().split('T')[0]} 
                            className='text-sm text-gray-500 outline-none cursor-pointer' 
                            required 
                        />
                    </div>

                    {/* Return Date */}
                    <div className='flex flex-col items-start gap-1 border-gray-200 md:border-l md:pl-8'>
                        <label className='text-base font-bold' htmlFor='return-date'>Return Date</label>
                        <input 
                            value={returnDate} 
                            onChange={e => setReturnDate(e.target.value)}
                            type="date" 
                            id="return-date" 
                            // Added: min date set to pickupDate so return can't be before pickup
                            min={pickupDate || new Date().toISOString().split('T')[0]}
                            className='text-sm text-gray-500 outline-none cursor-pointer' 
                            required 
                        />
                    </div>
                </div>

                {/* Adjusted Search Button */}
                <div className='md:pr-2'>
                    <button 
                        type="submit"
                        className='flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md cursor-pointer whitespace-nowrap'
                    >
                        <img src={assets.search_icon} alt="search" className='w-4 h-4 invert' />
                        <span className='font-medium'>Search Cars</span>
                    </button>
                </div>

            </form>

            {/* Hero Car Image */}
            <div className='w-full flex justify-center'>
                <img src={assets.main_car} alt="car" className='max-w-[90%] md:max-w-[700px] h-auto object-contain drop-shadow-2xl' />
            </div>

        </div>
    )
}

export default Hero