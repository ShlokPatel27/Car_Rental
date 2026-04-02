import React, { useEffect, useState, useCallback } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCards'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Cars = () => {
    const [searchParams] = useSearchParams()
    const pickupLocation = searchParams.get('pickupLocation')
    const pickupDate = searchParams.get('pickupDate')
    const returnDate = searchParams.get('returnDate')

    const { cars, axios } = useAppContext()

    const [input, setInput] = useState('')
    const [filteredCars, setFilteredCars] = useState([])
    const [masterList, setMasterList] = useState([]) 
    
    const isSearchData = pickupDate && pickupLocation && returnDate

    const fetchAvailability = async () => {
        try {
            const { data } = await axios.post('/api/bookings/check-availability', { 
                location: pickupLocation, 
                pickupDate, 
                returnDate 
            })
            
            if (data.success) {
                setMasterList(data.availableCars)
                setFilteredCars(data.availableCars)
                if (data.availableCars.length === 0) {
                    toast.error('No cars available for these specific dates/location')
                }
            }
        } catch (error) {
            toast.error("Error fetching available cars")
        }
    }

    useEffect(() => {
        if (isSearchData) {
            fetchAvailability()
        } else {
            setMasterList(cars)
            setFilteredCars(cars)
        }
    }, [isSearchData, cars, pickupLocation])

    useEffect(() => {
        if (input.trim() === '') {
            setFilteredCars(masterList)
        } else {
            const filtered = masterList.filter((car) => {
                const searchTag = `${car.brand} ${car.model} ${car.category}`.toLowerCase()
                return searchTag.includes(input.toLowerCase())
            })
            setFilteredCars(filtered)
        }
    }, [input, masterList])

    return (
        <div className='min-h-screen pb-20'>
            {/* Header Section - Optimized padding */}
            <div className='flex flex-col items-center py-16 bg-light px-4'>
                <Title 
                    title={isSearchData ? 'Available Now' : 'All Luxury Cars'} 
                    subTitle='Browse our full fleet of premium vehicles.' 
                />

                <div className='flex items-center bg-white px-5 mt-8 max-w-2xl w-full h-14 rounded-full shadow-md border border-gray-100'>
                    <img src={assets.search_icon} alt="" className='w-5 h-5 mr-3 opacity-50' />
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        type="text" 
                        placeholder='Search by brand or model...' 
                        className='w-full h-full outline-none text-gray-700 bg-transparent text-lg' 
                    />
                </div>
            </div>

            {/* List Section - Reduced side padding for a wider look */}
            <div className='px-4 md:px-8 lg:px-12 mt-10'>
                <div className='max-w-7xl mx-auto flex justify-between items-center mb-10'>
                    <p className='text-gray-500'>
                        Showing <span className='text-blue-600 font-bold'>{filteredCars.length}</span> Cars
                    </p>
                    
                    {isSearchData && (
                        <div className='flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200'>
                            <div className='w-2 h-2 bg-blue-600 rounded-full animate-pulse'></div>
                            <p className='text-blue-700 text-sm font-medium'>Available for your trip</p>
                        </div>
                    )}
                </div>

                {/* The Grid - Now uses max-width 7xl with balanced gaps */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                            <div key={car._id}>
                                <CarCard car={car} />
                            </div>
                        ))
                    ) : (
                        <div className='col-span-full text-center py-20'>
                            <p className='text-gray-400 text-lg'>No cars found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cars