import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast' // Make sure this matches your toast library

const ManageCars = () => {

    const { isOwner, axios, currency } = useAppContext()
    const [cars, setCars] = useState([])

    const fetchOwnerCars = async () => {
        try {
            const { data } = await axios.get('/api/owner/cars')
            if (data.success) {
                setCars(data.cars)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const toggleAvailabilty = async (carId) => {
        try {
            const { data } = await axios.post('/api/owner/toggle-car', { carId })
            if (data.success) {
                toast.success(data.message) // Fixed from toggle.success
                fetchOwnerCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const deleteCar = async (carId) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this Car?')
            if (!confirmDelete) return

            const { data } = await axios.post('/api/owner/delete-car', { carId })
            if (data.success) {
                toast.success(data.message) // Fixed from toggle.success
                fetchOwnerCars()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (isOwner) {
            fetchOwnerCars()
        }
    }, [isOwner])

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            
            <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform." />

            <div className='max-w-4xl w-full rounded-md overflow-hidden border border-gray-200 mt-6'>
                
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500 bg-gray-50'>
                        <tr>
                            <th className="p-3 font-medium">Car</th>
                            <th className="p-3 font-medium max-md:hidden">Category</th>
                            <th className="p-3 font-medium">Price</th>
                            <th className="p-3 font-medium max-md:hidden">Status</th>
                            <th className="p-3 font-medium text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cars.length > 0 ? cars.map((car, index) => (
                            <tr key={index} className='border-t border-gray-200 hover:bg-gray-50 transition-colors'>
                                
                                {/* Car Information */}
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover bg-gray-100' />
                                    <div>
                                        <p className='font-medium text-gray-800'>{car.brand} {car.model}</p>
                                        <p className='text-xs text-gray-500 md:hidden'>{car.category} • {car.transmission}</p>
                                        <p className='text-xs text-gray-500 max-md:hidden'>{car.seating_capacity} Seats • {car.transmission}</p>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className='p-3 max-md:hidden'>{car.category}</td>

                                {/* Price */}
                                <td className='p-3 font-medium'>{currency}{car.pricePerDay}<span className='text-xs text-gray-400 font-normal'>/day</span></td>

                                {/* Availability Status */}
                                <td className='p-3 max-md:hidden'>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${car.isAvaliable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {car.isAvaliable ? "Available" : "Unavailable"}
                                    </span>
                                </td>

                                {/* Action Buttons */}
                                <td className='p-3'>
                                    <div className='flex items-center justify-center gap-4'>
                                        <img 
                                            onClick={() => toggleAvailabilty(car._id)}
                                            src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} 
                                            alt="Toggle View" 
                                            title="Toggle Availability"
                                            className='w-10 cursor-pointer hover:opacity-70 transition-opacity' 
                                        />
                                        <img 
                                            onClick={() => deleteCar(car._id)}
                                            src={assets.delete_icon} 
                                            alt="Delete Car" 
                                            title="Delete Car"
                                            className='w-10 cursor-pointer hover:opacity-70 transition-opacity' 
                                        />
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-400">No cars found. Start by adding one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageCars