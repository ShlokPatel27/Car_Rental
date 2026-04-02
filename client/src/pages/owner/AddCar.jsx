import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast' // Added this import - ensure you have react-hot-toast installed

const AddCar = () => {

    const { axios, currency } = useAppContext()

    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    
    const initialCarState = {
        brand: '',
        model: '',
        year: '',
        pricePerDay: '',
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: '',
        location: '',
        description: '',
    }

    const [car, setCar] = useState(initialCarState)

    // Helper to handle all input changes
    const onInputChange = (e) => {
        const { name, value } = e.target
        setCar(prev => ({ ...prev, [name]: value }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        if (!image) {
            return toast.error("Please upload a car image")
        }

        setIsLoading(true)
        
        try {
            const formData = new FormData()
            formData.append("image", image)
            formData.append("carData", JSON.stringify(car))

            const { data } = await axios.post('/api/owner/add-car', formData)

            if (data.success) {
                toast.success(data.message || "✅ Car Added Successfully!")
                setImage(null)
                setCar(initialCarState)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='px-4 py-10 md:px-10 flex-1 bg-white'>

            <Title title="Add New Car" subTitle="Fill in details to list a new car for booking." />

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-600 text-sm mt-6 max-w-xl'>

                {/* Car Image */}
                <div className='flex items-center gap-4 w-full p-4 border border-dashed border-gray-300 rounded-lg'>
                    <label htmlFor="car-image" className='cursor-pointer'>
                        <img 
                            src={image ? URL.createObjectURL(image) : assets.upload_icon} 
                            alt="Upload Preview" 
                            className='w-20 h-20 object-cover rounded bg-gray-50' 
                        />
                        <input type="file" id="car-image" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                    <p className='text-sm text-gray-500'>Click icon to upload car photo</p>
                </div>

                {/* Brand & Model */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-1'>
                        <label>Brand</label>
                        <input name="brand" type="text" placeholder="e.g. BMW" required 
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500' 
                            value={car.brand} onChange={onInputChange} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Model</label>
                        <input name="model" type="text" placeholder="e.g. X5" required 
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500' 
                            value={car.model} onChange={onInputChange} />
                    </div>
                </div>

                {/* Year, Price, Category */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                    <div className='flex flex-col gap-1'>
                        <label>Year</label>
                        <input name="year" type="number" placeholder="2025" required 
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                            value={car.year} onChange={onInputChange} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Daily Price ({currency})</label>
                        <input name="pricePerDay" type="number" placeholder="100" required 
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                            value={car.pricePerDay} onChange={onInputChange} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Category</label>
                        <select name="category" onChange={onInputChange} value={car.category} required
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none'>
                            <option value="">Select</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Van">Van</option>
                            <option value="Sports">Sports</option>
                            <option value="Super">Super</option>
                            <option value="Muscle">Muscle</option>
                        </select>
                    </div>
                </div>

                {/* Transmission, Fuel, Capacity */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                    <div className='flex flex-col gap-1'>
                        <label>Transmission</label>
                        <select name="transmission" onChange={onInputChange} value={car.transmission} required
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none'>
                            <option value="">Select</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            
                        </select>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Fuel Type</label>
                        <select name="fuel_type" onChange={onInputChange} value={car.fuel_type} required
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none'>
                            <option value="">Select</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                        </select>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label>Seats</label>
                        <input name="seating_capacity" type="number" placeholder="4" required 
                            className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                            value={car.seating_capacity} onChange={onInputChange} />
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Location</label>
                    <select name="location" onChange={onInputChange} value={car.location} required
                        className='px-3 py-2 border border-gray-300 rounded-md outline-none'>
                        <option value="">Select a location</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Rajkot">Rajkot</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        
                    </select>
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Description</label>
                    <textarea name="description" rows={3} placeholder="Tell us about the car..." required 
                        className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                        value={car.description} onChange={onInputChange}></textarea>
                </div>

                {/* Fixed Button: Added specific blue color if 'bg-primary' is missing */}
                <button 
                    disabled={isLoading}
                    type="submit"
                    className='flex items-center justify-center gap-2 px-10 py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium w-max transition-all disabled:bg-gray-400'
                >
                    {!isLoading && assets.tick_icon && <img src={assets.tick_icon} alt="" className='w-4' />}
                    {isLoading ? 'Processing...' : 'List Your Car'}
                </button>

            </form>
        </div>
    )
}

export default AddCar