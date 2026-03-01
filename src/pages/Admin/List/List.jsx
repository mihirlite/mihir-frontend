import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Link } from 'react-router-dom';

const List = ({ url, token }) => {
    const [list, setList] = useState([]);

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
            setList(response.data.data)
        }
        else {
            toast.error("Error")
        }
    }

    const removeFood = async (foodId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, { headers: { token } });
            await fetchList();
            if (response.data.success) {
                toast.success(response.data.message)
            }
            else {
                toast.error("Error")
            }
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-2xl font-black text-gray-800 mb-1'>All Products</h3>
                    <p className='text-sm text-gray-500'>Manage your menu items and availability</p>
                </div>
                <button onClick={fetchList} className='w-fit px-6 py-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl font-bold transition-all border border-gray-100'>
                    Refresh List
                </button>
            </div>

            {/* Desktop Table Selection */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className='text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6'>
                            <th className='pb-2 pl-6'>Product</th>
                            <th className='pb-2'>Category</th>
                            <th className='pb-2'>Type</th>
                            <th className='pb-2'>Price</th>
                            <th className='pb-2 text-right pr-6'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, index) => (
                            <tr key={index} className='bg-gray-50/50 hover:bg-white transition-all group'>
                                <td className='py-4 pl-6 rounded-l-3xl border-y border-l border-transparent hover:border-orange-100'>
                                    <div className='flex items-center gap-4'>
                                        <img className='w-12 h-12 object-cover rounded-xl shadow-sm group-hover:scale-110 transition-transform' src={(Array.isArray(item.image) ? item.image[0] : item.image).startsWith("http") ? (Array.isArray(item.image) ? item.image[0] : item.image) : `${url}/images/` + (Array.isArray(item.image) ? item.image[0] : item.image)} alt="" />
                                        <p className='font-bold text-gray-700'>{item.name}</p>
                                    </div>
                                </td>
                                <td className='py-4 border-y border-transparent'>
                                    <span className='px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold'>{item.category}</span>
                                </td>
                                <td className='py-4 border-y border-transparent'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.veg ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {item.veg ? 'Veg' : 'Non-Veg'}
                                    </span>
                                </td>
                                <td className='py-4 border-y border-transparent font-black text-gray-800'>₹{item.price}</td>
                                <td className='py-4 pr-6 rounded-r-3xl border-y border-r border-transparent text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <Link
                                            to={`/admin/edit/${item._id}`}
                                            className='p-2 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all active:scale-95'
                                        >
                                            <MdOutlineEdit size={22} />
                                        </Link>
                                        <button
                                            onClick={() => removeFood(item._id)}
                                            className='p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-95'
                                        >
                                            <MdDeleteOutline size={22} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Selection */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {list.map((item, index) => (
                    <div key={index} className='bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-4'>
                            <img className='w-14 h-14 object-cover rounded-2xl' src={(Array.isArray(item.image) ? item.image[0] : item.image).startsWith("http") ? (Array.isArray(item.image) ? item.image[0] : item.image) : `${url}/images/` + (Array.isArray(item.image) ? item.image[0] : item.image)} alt="" />
                            <div>
                                <p className='font-bold text-gray-800 mb-1'>{item.name}</p>
                                <div className='flex gap-2 items-center'>
                                    <span className='text-[10px] font-bold text-orange-600 uppercase tracking-tighter'>{item.category}</span>
                                    <span className={`text-[10px] font-bold uppercase ${item.veg ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.veg ? 'Veg' : 'Non-Veg'}
                                    </span>
                                </div>
                                <p className='text-sm font-black text-gray-900 mt-1'>₹{item.price}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Link
                                to={`/admin/edit/${item._id}`}
                                className='p-3 bg-white text-orange-500 rounded-2xl shadow-sm border border-orange-50 active:scale-90 transition-all flex items-center justify-center'
                            >
                                <MdOutlineEdit size={20} />
                            </Link>
                            <button
                                onClick={() => removeFood(item._id)}
                                className='p-3 bg-white text-red-500 rounded-2xl shadow-sm border border-red-50 active:scale-90 transition-all'
                            >
                                <MdDeleteOutline size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default List
