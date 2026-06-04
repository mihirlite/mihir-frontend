import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdCloudUpload, MdDelete } from "react-icons/md";

const HeroImageManager = ({ url, token }) => {
    const [image, setImage] = useState(null)
    const [heroImages, setHeroImages] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchHeroImages = async () => {
        try {
            const response = await axios.get(`${url}/api/hero-image/list`)
            if (response.data.success) {
                setHeroImages(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching hero images:", error)
        }
    }

    const onImageChange = (event) => {
        setImage(event.target.files[0])
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        if (!image) {
            toast.error("Please select an image")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("image", image)
        formData.append("altText", "Hero Image")

        try {
            const response = await axios.post(`${url}/api/hero-image/add`, formData, { headers: { token } })
            if (response.data.success) {
                setImage(null)
                toast.success(response.data.message)
                fetchHeroImages()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error uploading hero image")
        } finally {
            setLoading(false)
        }
    }

    const removeHeroImage = async (id) => {
        try {
            const response = await axios.post(`${url}/api/hero-image/remove`, { id }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                fetchHeroImages()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error removing hero image")
        }
    }

    useEffect(() => {
        fetchHeroImages()
    }, [])

    return (
        <div className='animate-fadeIn p-4 md:p-8'>
            <div className='mb-8'>
                <h3 className='text-2xl font-black text-gray-800 mb-1'>Hero Image Manager</h3>
                <p className='text-sm text-gray-500'>Upload and manage images for the home page hero section</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                {/* Upload Section */}
                <form className='flex flex-col gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100' onSubmit={onSubmitHandler}>
                    <div className="flex flex-col gap-3">
                        <p className='text-sm font-bold text-gray-700'>Upload New Hero Image</p>
                        <label htmlFor="hero-image" className='group cursor-pointer'>
                            <div className={`
                                w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 min-h-[220px] p-4
                                ${image ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50/30'}
                            `}>
                                {image ? (
                                    <div className='w-full h-full rounded-xl overflow-hidden shadow-sm'>
                                        <img src={URL.createObjectURL(image)} className='w-full h-48 object-cover' alt="" />
                                    </div>
                                ) : (
                                    <>
                                        <MdCloudUpload className='text-4xl text-gray-300 group-hover:text-orange-400' />
                                        <p className='text-[13px] text-gray-400 group-hover:text-orange-500'>Click to upload image</p>
                                    </>
                                )}
                            </div>
                        </label>
                        <input onChange={onImageChange} type="file" id="hero-image" hidden accept="image/*" />
                    </div>

                    <button 
                        disabled={loading}
                        type='submit' 
                        className={`
                            px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100
                            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600 hover:scale-[1.02] active:scale-95'}
                        `}
                    >
                        {loading ? 'Uploading...' : 'Add Hero Image'}
                    </button>
                </form>

                {/* List Section */}
                <div className='flex flex-col gap-6'>
                    <p className='text-sm font-bold text-gray-700'>Current Hero Images ({heroImages.length})</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {heroImages.length === 0 ? (
                            <p className='text-sm text-gray-400 italic'>No images uploaded yet.</p>
                        ) : (
                            heroImages.map((img) => (
                                <div key={img._id} className='relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm'>
                                    <img src={img.image} className='w-full h-32 object-cover' alt={img.altText} />
                                    <button 
                                        onClick={() => removeHeroImage(img._id)}
                                        className='absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600'
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroImageManager
