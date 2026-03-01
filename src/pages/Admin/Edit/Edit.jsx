import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdCloudUpload } from "react-icons/md";
import { useParams, useNavigate } from 'react-router-dom';

const Edit = ({ url, token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        veg: "true"
    })

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`${url}/api/food/get-item?id=${id}`);
            if (response.data.success) {
                const item = response.data.data;
                setData({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                    veg: String(item.veg)
                })
                setExistingImages(Array.isArray(item.image) ? item.image : [item.image])
            } else {
                toast.error("Error fetching item details")
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching item details")
        }
    }

    useEffect(() => {
        fetchItemDetails();
    }, [id])

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 4) {
            toast.error("Maximum 4 images allowed");
            return;
        }
        setImages(selectedFiles);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("id", id)
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("veg", data.veg)

        if (images.length > 0) {
            images.forEach((img) => {
                formData.append("image", img);
            });
        }

        try {
            const response = await axios.post(`${url}/api/food/update`, formData, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/admin/list')
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating food")
        }
    }

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8'>
                <h3 className='text-2xl font-black text-gray-800 mb-1'>Edit Product</h3>
                <p className='text-sm text-gray-500'>Update the details of your food item</p>
            </div>

            <form className='grid grid-cols-1 lg:grid-cols-12 gap-10' onSubmit={onSubmitHandler}>
                {/* Image Upload Selection */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <p className='text-sm font-bold text-gray-700'>Image Upload (Max 4)</p>
                    <label htmlFor="image" className='group cursor-pointer'>
                        <div className={`
                            w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 min-h-[220px] p-4
                            ${(images.length > 0 || existingImages.length > 0) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/30'}
                        `}>
                            {images.length > 0 ? (
                                <div className='grid grid-cols-2 gap-3 w-full'>
                                    {images.map((img, index) => (
                                        <div key={index} className='aspect-square rounded-xl overflow-hidden shadow-sm'>
                                            <img src={URL.createObjectURL(img)} className='w-full h-full object-cover' alt="" />
                                        </div>
                                    ))}
                                    {images.length < 4 && (
                                        <div className='aspect-square rounded-xl border-2 border-dashed border-orange-200 flex items-center justify-center bg-white/50'>
                                            <MdCloudUpload className='text-2xl text-orange-300' />
                                        </div>
                                    )}
                                </div>
                            ) : existingImages.length > 0 ? (
                                <div className='grid grid-cols-2 gap-3 w-full'>
                                    {existingImages.map((img, index) => (
                                        <div key={index} className='aspect-square rounded-xl overflow-hidden shadow-sm'>
                                            <img src={img.startsWith("http") ? img : `${url}/images/` + img} className='w-full h-full object-cover' alt="" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <MdCloudUpload className='text-4xl text-gray-300 group-hover:text-orange-400' />
                                    <p className='text-[13px] text-gray-400 group-hover:text-orange-500'>Click to upload new images</p>
                                    <p className='text-[11px] text-gray-300'>Select up to 4 images</p>
                                </>
                            )}
                        </div>
                    </label>
                    <input onChange={onImageChange} type="file" id="image" hidden multiple accept="image/*" />
                    {images.length > 0 && (
                        <button type="button" onClick={() => setImages([])} className='text-xs text-red-500 font-bold hover:underline self-end'>
                            Restore Originals
                        </button>
                    )}
                </div>

                {/* Form Fields Selection */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className='text-sm font-bold text-gray-700'>Product Name</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.name}
                            className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium'
                            type="text"
                            name="name"
                            placeholder='e.g. Garden Fresh Salad'
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className='text-sm font-bold text-gray-700'>Product Description</p>
                        <textarea
                            onChange={onChangeHandler}
                            value={data.description}
                            className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium'
                            name="description"
                            rows="4"
                            placeholder='Describe the flavors, ingredients, etc.'
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Category</p>
                            <select onChange={onChangeHandler} value={data.category} name="category" className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium cursor-pointer'>
                                <option value="Salad">Salad</option>
                                <option value="Rolls">Rolls</option>
                                <option value="Deserts">Deserts</option>
                                <option value="Sandwich">Sandwich</option>
                                <option value="Cake">Cake</option>
                                <option value="Pure Veg">Pure Veg</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Noodles">Noodles</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Food Type</p>
                            <select onChange={onChangeHandler} value={data.veg} name="veg" className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium cursor-pointer'>
                                <option value="true">Veg</option>
                                <option value="false">Non-Veg</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Price (₹)</p>
                            <input
                                onChange={onChangeHandler}
                                value={data.price}
                                className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium'
                                type="Number"
                                name='price'
                                placeholder='20'
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type='submit' className='mt-4 w-full md:w-fit px-12 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100'>
                            Update Product
                        </button>
                        <button type='button' onClick={() => navigate('/admin/list')} className='mt-4 w-full md:w-fit px-12 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95'>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Edit
