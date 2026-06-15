import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion } from 'framer-motion' // Note: Double check if your package is 'framer-motion' or 'motion/react' depending on your installation

const Hero = () => {
    
    const locations = ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara', 'Gandhinagar']
    const [pickupLocation, setPickupLocation] = useState('')
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()

    const handleSearch = (e) => {
        e.preventDefault()
        navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate)
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center px-4'
        >
            <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='text-4xl md:text-5xl font-semibold'
            >
                Luxury cars on Rent
            </motion.h1>

            {/* Main Form Container */}
            <motion.form 
                onSubmit={handleSearch} 
                className='flex flex-col md:flex-row items-center justify-between p-4 md:p-2 rounded-3xl md:rounded-full w-full max-w-lg md:max-w-4xl bg-white shadow-lg border border-gray-100'
            >
                {/* Fixed: Turned this into a motion.div and passed the animations correctly */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className='flex flex-col md:flex-row items-center gap-8 md:gap-12 flex-grow px-6 py-4'
                >
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

                    <div className='flex flex-col items-start gap-1 border-gray-200 md:border-l md:pl-8'>
                        <label className='text-base font-bold' htmlFor='return-date'>Return Date</label>
                        <input 
                            value={returnDate} 
                            onChange={e => setReturnDate(e.target.value)}
                            type="date" 
                            id="return-date" 
                            min={pickupDate || new Date().toISOString().split('T')[0]}
                            className='text-sm text-gray-500 outline-none cursor-pointer' 
                            required 
                        />
                    </div>
                </motion.div>

                <div className='md:pr-2'>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className='flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md cursor-pointer whitespace-nowrap'
                    >
                        <img src={assets.search_icon} alt="search" className='w-4 h-4 invert' />
                        <span className='font-medium'>Search Cars</span>
                    </motion.button>
                </div>
            </motion.form>

            <div className='w-full flex justify-center'>
                <motion.img 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    src={assets.main_car} 
                    alt="car" 
                    className='max-w-[90%] md:max-w-[700px] h-auto object-contain drop-shadow-2xl' 
                />
            </div>
        </motion.div>
    )
}

export default Hero
