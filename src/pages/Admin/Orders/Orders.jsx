import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdOutlineLocalShipping, MdOutlineContactPhone, MdKeyboardArrowDown } from "react-icons/md";

const Orders = ({ url, token }) => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/order/list", { headers: { token } });
        if (response.data.success) {
            setOrders(response.data.data);
        }
        else {
            toast.error("Error")
        }
    }

    const statusHandler = async (event, orderId) => {
        const response = await axios.post(url + "/api/order/status", {
            orderId,
            status: event.target.value
        }, { headers: { token } })
        if (response.data.success) {
            await fetchAllOrders();
        }
    }

    const verifyOtpHandler = async (orderId) => {
        const otp = otpInputs[orderId];
        if (!otp || otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }

        const response = await axios.post(url + "/api/order/verify-otp", {
            orderId,
            otp
        }, { headers: { token } });

        if (response.data.success) {
            toast.success(response.data.message);
            setOtpInputs(prev => {
                const newState = { ...prev };
                delete newState[orderId];
                return newState;
            });
            await fetchAllOrders();
        } else {
            toast.error(response.data.message);
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-2xl font-black text-gray-800 mb-1'>Order Management</h3>
                    <p className='text-sm text-gray-500'>Monitor and update delivery statuses</p>
                </div>
                <button onClick={fetchAllOrders} className='w-fit px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95'>
                    Refresh Orders
                </button>
            </div>

            <div className="flex flex-col gap-8">
                {orders.map((order, index) => (
                    <div key={index} className='bg-gray-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden hover:bg-white transition-all duration-300 group hover:shadow-xl hover:shadow-orange-500/5'>
                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Order Icon Section Selection */}
                            <div className="lg:col-span-1 flex lg:flex-col items-center justify-center">
                                <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform'>
                                    <MdOutlineLocalShipping className='text-3xl text-orange-500' />
                                </div>
                            </div>

                            {/* Order Details Selection */}
                            <div className="lg:col-span-5">
                                <p className='text-xs font-black text-orange-500 uppercase tracking-widest mb-3'>Items</p>
                                <div className='space-y-1 mb-8'>
                                    {order.items.map((item, i) => (
                                        <div key={i} className='flex justify-between items-center bg-white/50 p-2 rounded-xl text-sm'>
                                            <span className='font-bold text-gray-700'>{item.name}</span>
                                            <span className='px-2 py-0.5 bg-orange-100 text-orange-600 rounded-lg font-black'>x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className='flex items-center gap-4 py-4 border-t border-gray-200/50'>
                                    <div className='bg-white p-3 rounded-2xl shadow-sm'>
                                        <MdOutlineContactPhone className='text-xl text-gray-400' />
                                    </div>
                                    <div>
                                        <p className='font-black text-gray-800'>{order.address.firstName + " " + order.address.lastName}</p>
                                        <p className='text-sm text-gray-500 font-medium'>{order.address.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section Selection */}
                            <div className="lg:col-span-3">
                                <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3'>Delivery Location</p>
                                <div className='text-sm text-gray-600 leading-relaxed font-medium bg-white/40 p-4 rounded-2xl border border-white/60'>
                                    <p className='font-black text-gray-900 text-lg mb-1'>{order.address.address}</p>
                                    <p className='text-xs text-gray-400 mt-2 italic font-medium'>Standard Delivery Point</p>
                                </div>
                            </div>

                            {/* Status & Action Selection */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                <div className='p-4 bg-white rounded-3xl shadow-sm border border-gray-50'>
                                    <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-center'>Total Amount</p>
                                    <p className='text-3xl font-black text-center text-gray-900'>${order.amount}</p>
                                </div>

                                <div className='relative'>
                                    <select
                                        onChange={(event) => statusHandler(event, order._id)}
                                        value={order.status}
                                        className='w-full appearance-none bg-orange-50 border-2 border-orange-100 text-orange-600 font-black py-4 px-6 rounded-2xl outline-none focus:border-orange-500 cursor-pointer transition-all'
                                    >
                                        <option value="Food Processing">Food Processing</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <MdKeyboardArrowDown className='absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-orange-400 pointer-events-none' />
                                </div>

                                {order.status === "Out for delivery" && (
                                    <div className='flex flex-col gap-2 p-4 bg-orange-500/5 rounded-3xl border border-orange-200/30'>
                                        <input
                                            type="text"
                                            placeholder="4-Digit OTP"
                                            className='p-3.5 bg-white border border-orange-100 rounded-2xl text-center font-black tracking-[0.5em] outline-none focus:border-orange-500 shadow-sm'
                                            value={otpInputs[order._id] || ""}
                                            onChange={(e) => setOtpInputs({ ...otpInputs, [order._id]: e.target.value })}
                                            maxLength={4}
                                        />
                                        <button
                                            onClick={() => verifyOtpHandler(order._id)}
                                            className='bg-orange-600 text-white py-3.5 rounded-2xl font-black hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-500/20'
                                        >
                                            Complete Delivery
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
