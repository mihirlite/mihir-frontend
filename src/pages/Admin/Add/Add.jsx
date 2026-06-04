import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdCloudUpload } from "react-icons/md";

const Add = ({ url, token }) => {
    const [images, setImages] = useState([])
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        discount: "",
        category: "Salad",
        veg: "true",
        isCombo: false
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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
        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        // Use original price and discount
        const originalPrice = Number(data.price) || 0;
        const discountPercentage = Number(data.discount) || 0;

        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", originalPrice) // Send original price
        formData.append("discount", discountPercentage) // Send discount
        formData.append("category", data.category)
        formData.append("veg", data.veg)
        formData.append("isCombo", data.isCombo)

        images.forEach((img) => {
            formData.append("image", img);
        });

        try {
            const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    discount: "",
                    category: "Salad",
                    veg: "true",
                    isCombo: false
                })
                setImages([])
                toast.success(response.data.message)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error("Error adding food")
        }
    }

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8'>
                <h3 className='text-3xl font-black text-gray-900 mb-1 tracking-tight'>Add New Product</h3>
                <p className='text-sm text-gray-500 font-medium'>Create a new food item with up to 4 images</p>
            </div>

            <form className='grid grid-cols-1 lg:grid-cols-12 gap-10' onSubmit={onSubmitHandler}>
                {/* Image Upload Selection */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <p className='text-sm font-bold text-gray-700'>Image Upload (Max 4)</p>
                    <label htmlFor="image" className='group cursor-pointer'>
                        <div className={`
                            w-full rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500 min-h-[260px] p-6
                            ${images.length > 0 ? 'border-orange-500 bg-orange-50/50 shadow-inner' : 'border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/30'}
                        `}>
                            {images.length > 0 ? (
                                <div className='grid grid-cols-2 gap-3 w-full'>
                                    {images.map((img, index) => (
                                        <div key={index} className='aspect-square rounded-2xl overflow-hidden shadow-md ring-2 ring-white'>
                                            <img src={URL.createObjectURL(img)} className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-500' alt="" />
                                        </div>
                                    ))}
                                    {images.length < 4 && (
                                        <div className='aspect-square rounded-2xl border-2 border-dashed border-orange-200 flex items-center justify-center bg-white/50 animate-pulse'>
                                            <MdCloudUpload className='text-2xl text-orange-300' />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="p-5 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <MdCloudUpload className='text-4xl text-gray-300 group-hover:text-orange-500 transition-colors' />
                                    </div>
                                    <div className="text-center">
                                        <p className='text-[15px] font-bold text-gray-400 group-hover:text-orange-600 transition-colors'>Click to upload images</p>
                                        <p className='text-[11px] text-gray-300 font-medium mt-1 uppercase tracking-widest'>Select up to 4 images</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </label>
                    <input onChange={onImageChange} type="file" id="image" hidden multiple accept="image/*" />
                    {images.length > 0 && (
                        <button type="button" onClick={() => setImages([])} className='text-xs text-red-500 font-black hover:text-red-600 transition-colors flex items-center gap-1 self-end bg-red-50 px-3 py-1 rounded-full'>
                            Clear All Images
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
                            className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-semibold shadow-sm focus:shadow-md'
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
                            className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-semibold resize-none shadow-sm focus:shadow-md'
                            name="description"
                            rows="4"
                            placeholder='Describe the flavors, ingredients, etc.'
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Category</p>
                            <select onChange={onChangeHandler} value={data.category} name="category" className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-semibold cursor-pointer shadow-sm'>
                                <option value="Salad">Salad</option>
                                <option value="Rolls">Rolls</option>
                                <option value="Deserts">Deserts</option>
                                <option value="Sandwich">Sandwich</option>
                                <option value="Cake">Cake</option>
                                <option value="Pure Veg">Pure Veg</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Noodles">Noodles</option>
                                <option value="Combos">Combos</option>
                                <option value="Add-ons">Add-ons</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Food Type</p>
                            <select onChange={onChangeHandler} value={data.veg} name="veg" className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-semibold cursor-pointer shadow-sm'>
                                <option value="true">Veg</option>
                                <option value="false">Non-Veg</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Price (₹)</p>
                            <input
                                onChange={onChangeHandler}
                                value={data.price}
                                className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-black shadow-sm focus:shadow-md text-gray-800'
                                type="Number"
                                name='price'
                                placeholder='100'
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Discount (%)</p>
                            <input
                                onChange={onChangeHandler}
                                value={data.discount || ""}
                                className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-black shadow-sm focus:shadow-md text-orange-600'
                                type="Number"
                                name='discount'
                                placeholder='15'
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="flex bg-orange-50/50 p-4 rounded-2xl border border-orange-100 items-center justify-between">
                        <div>
                            <p className='text-sm font-bold text-gray-800'>Show as Extra Combo?</p>
                            <p className='text-xs text-gray-500 mt-1'>If enabled, this item will appear in the "Don't forget these extras!" slider in the Cart.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="isCombo" 
                                className="sr-only peer" 
                                checked={data.isCombo} 
                                onChange={onChangeHandler} 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    {/* Discount Calculation Bar */}
                    {data.price && Number(data.price) > 0 && (
                        <div className="mt-2 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] shadow-2xl p-1 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-[1.8rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Original Price</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-white">₹{data.price}</span>
                                        </div>
                                    </div>

                                    {data.discount && Number(data.discount) > 0 ? (
                                        <>
                                            <div className="h-8 w-[2px] bg-gray-700 self-center opacity-50"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.2em]">Discount Applied</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-black text-orange-500 italic block">{data.discount}% OFF</span>
                                                    <div className="px-2 py-0.5 bg-orange-500 text-[10px] font-black text-white rounded-full">SAVING ₹{(Number(data.price) * Number(data.discount) / 100).toFixed(0)}</div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-500 text-[11px] font-bold italic tracking-wide">No discount applied</div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center md:items-end bg-white/10 px-8 py-3 rounded-3xl border border-white/10 shadow-inner">
                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em]">Final Payable Price</span>
                                    <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">
                                        ₹{Math.max(0, Number(data.price) - (Number(data.price) * (Number(data.discount) || 0) / 100)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button type='submit' className='mt-4 w-full md:w-fit px-12 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100'>
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Add
