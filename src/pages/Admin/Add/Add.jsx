import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdCloudUpload } from "react-icons/md";

const Add = ({ url, token }) => {
    const [image, setImage] = useState(false)
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        veg: "true"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("veg", data.veg)
        formData.append("image", image)
        try {
            const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad",
                    veg: "true"
                })
                setImage(false)
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
                <h3 className='text-2xl font-black text-gray-800 mb-1'>Add New Product</h3>
                <p className='text-sm text-gray-500'>Create a new food item for your menu</p>
            </div>

            <form className='grid grid-cols-1 lg:grid-cols-12 gap-10' onSubmit={onSubmitHandler}>
                {/* Image Upload Selection */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <p className='text-sm font-bold text-gray-700'>Image Upload</p>
                    <label htmlFor="image" className='group cursor-pointer'>
                        <div className={`
                            aspect-video w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300
                            ${image ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/30'}
                        `}>
                            {image ? (
                                <img src={URL.createObjectURL(image)} className='w-full h-full object-cover rounded-[22px]' alt="" />
                            ) : (
                                <>
                                    <MdCloudUpload className='text-4xl text-gray-300 group-hover:text-orange-400' />
                                    <p className='text-[13px] text-gray-400 group-hover:text-orange-500'>Click to upload</p>
                                </>
                            )}
                        </div>
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
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
                            <select onChange={onChangeHandler} name="category" className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium cursor-pointer'>
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
                            <select onChange={onChangeHandler} name="veg" className='p-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium cursor-pointer'>
                                <option value="true">Veg</option>
                                <option value="false">Non-Veg</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='text-sm font-bold text-gray-700'>Price ($)</p>
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

                    <button type='submit' className='mt-4 w-full md:w-fit px-12 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100'>
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Add
