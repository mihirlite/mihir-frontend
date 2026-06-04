import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdAdd, MdDeleteOutline, MdClose } from "react-icons/md"

const Coupons = ({ url, token }) => {
    const [coupons, setCoupons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState({
        name: "",
        type: "percentage",
        value: ""
    });

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${url}/api/coupon/list`, { headers: { token } });
            if (response.data.success) {
                setCoupons(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching coupons");
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/coupon/add`, data, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setShowModal(false);
                setData({ name: "", type: "percentage", value: "" });
                fetchCoupons();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error adding coupon");
        }
    }

    const toggleStatus = async (id) => {
        try {
            const response = await axios.post(`${url}/api/coupon/toggle-status`, { id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchCoupons();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error toggling status");
        }
    }

    const removeCoupon = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const response = await axios.post(`${url}/api/coupon/remove`, { id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchCoupons();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error removing coupon");
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className='animate-fadeIn'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Coupon Codes</h3>
                    <p className='text-sm text-gray-500 font-medium'>Manage your store discounts and offers</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all'
                >
                    <MdAdd size={24} />
                    Add Coupon
                </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider'>Coupon Name</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider'>Discount %</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider'>Fixed Price</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider'>Status</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan="5" className='px-6 py-12 text-center text-gray-400 font-medium'>
                                    No coupons found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            coupons.map((item, index) => (
                                <tr key={index} className='hover:bg-orange-50/30 transition-colors group'>
                                    <td className='px-6 py-5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs'>
                                                CP
                                            </div>
                                            <span className='font-bold text-gray-800'>{item.name}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5 font-bold text-gray-600'>
                                        {item.type === 'percentage' ? `${item.value}%` : '-'}
                                    </td>
                                    <td className='px-6 py-5 font-bold text-gray-600'>
                                        {item.type === 'fixed' ? `₹${item.value}` : '-'}
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div
                                            onClick={() => toggleStatus(item._id)}
                                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${item.isActive ? 'bg-green-500 shadow-md shadow-green-100' : 'bg-red-500 shadow-md shadow-red-100'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-all duration-300 ${item.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div className='flex justify-center'>
                                            <button
                                                onClick={() => removeCoupon(item._id)}
                                                className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all'
                                            >
                                                <MdDeleteOutline size={22} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn'>
                    <div className='bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-slideUp'>
                        <div className='p-8'>
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='text-2xl font-black text-gray-800'>Add New Coupon</h3>
                                <button onClick={() => setShowModal(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                                    <MdClose size={24} className='text-gray-400' />
                                </button>
                            </div>

                            <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold text-gray-700 ml-1'>Coupon Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. SUMMER50"
                                        required
                                        className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold'
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <label className='text-sm font-bold text-gray-700 ml-1'>Discount Type</label>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div
                                            onClick={() => setData({ ...data, type: "percentage" })}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 ${data.type === 'percentage' ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-gray-50 hover:border-orange-200"}`}
                                        >
                                            <span className={`text-sm font-black ${data.type === 'percentage' ? "text-orange-600" : "text-gray-500"}`}>Discount %</span>
                                            <span className='text-[10px] text-gray-400 font-bold'>Deduct percentage from total</span>
                                        </div>
                                        <div
                                            onClick={() => setData({ ...data, type: "fixed" })}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 ${data.type === 'fixed' ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-gray-50 hover:border-orange-200"}`}
                                        >
                                            <span className={`text-sm font-black ${data.type === 'fixed' ? "text-orange-600" : "text-gray-500"}`}>Fixed Price</span>
                                            <span className='text-[10px] text-gray-400 font-bold'>Deduct fixed amount</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-bold text-gray-700 ml-1'>
                                        {data.type === 'percentage' ? "Discount Percentage (Max 100%)" : "Discount Amount (₹)"}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder={data.type === 'percentage' ? "e.g. 10" : "e.g. 50"}
                                        required
                                        className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold'
                                        value={data.value}
                                        onChange={(e) => setData({ ...data, value: e.target.value })}
                                        max={data.type === 'percentage' ? 100 : undefined}
                                        min={1}
                                    />
                                </div>

                                <div className='flex gap-4 mt-4'>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className='flex-1 py-4 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className='flex-1 py-4 px-6 rounded-2xl font-bold bg-orange-500 text-white shadow-lg shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all'
                                    >
                                        Create Coupon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Coupons
