import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdOutlineLocalShipping, MdOutlineContactPhone, MdKeyboardArrowDown, MdRefresh } from "react-icons/md";

const Orders = ({ url, token }) => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(url + "/api/order/list", { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching orders");
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: event.target.value
            }, { headers: { token } })
            if (response.data.success) {
                toast.success("Status Updated");
                await fetchAllOrders();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status");
        }
    }

    const verifyOtpHandler = async (orderId) => {
        const otp = otpInputs[orderId];
        if (!otp || otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }

        try {
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
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    return (
        <div className='animate-fadeIn'>
            <div className='mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Order Management</h3>
                    <p className='text-sm text-gray-500 font-medium'>Monitor and update delivery statuses in real-time</p>
                </div>
                <button
                    onClick={fetchAllOrders}
                    className='flex items-center gap-2 px-8 py-3 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all shadow-sm active:scale-95'
                >
                    <MdRefresh size={20} />
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm bg-white">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Customer</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Items</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Qty</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Delivery Location</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Amount</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className='px-6 py-12 text-center text-gray-400 font-medium'>
                                    No orders found yet. Any new orders will appear here.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => (
                                <tr key={index} className='hover:bg-orange-50/30 transition-colors group'>
                                    <td className='px-6 py-5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0 uppercase'>
                                                {order.address.firstName[0]}{order.address.lastName[0]}
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-800 whitespace-nowrap'>{order.address.firstName + " " + order.address.lastName}</p>
                                                <p className='text-xs text-gray-400 font-medium'>{order.address.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div className='max-w-[200px]'>
                                            {order.items.map((item, i) => (
                                                <p key={i} className='text-sm text-gray-600 font-bold leading-tight mb-1 last:mb-0 truncate'>
                                                    {item.name}
                                                </p>
                                            ))}
                                        </div>
                                    </td>
                                    <td className='px-6 py-5 text-center'>
                                        <span className='px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-black text-xs'>
                                            {order.items.reduce((total, item) => total + item.quantity, 0)}
                                        </span>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <p className='text-sm text-gray-600 font-medium leading-relaxed max-w-[250px] line-clamp-2'>
                                            {order.address.address}, {order.address.city}, {order.address.state}
                                        </p>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <p className='text-xl font-black text-gray-900'>₹{order.amount}</p>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div className='flex flex-col gap-2 min-w-[180px]'>
                                            <div className='relative'>
                                                <select
                                                    onChange={(event) => statusHandler(event, order._id)}
                                                    value={order.status}
                                                    className={`w-full appearance-none border-2 font-black py-2.5 px-4 rounded-xl outline-none cursor-pointer transition-all text-sm
                                                        ${order.status === "Cancelled" ? "bg-red-50 border-red-100 text-red-600 focus:border-red-500" :
                                                            order.status === "Delivered" ? "bg-green-50 border-green-100 text-green-600 focus:border-green-500" :
                                                                "bg-orange-50 border-orange-100 text-orange-600 focus:border-orange-500"}
                                                    `}
                                                >
                                                    <option value="Food Processing">Food Processing</option>
                                                    <option value="Out for delivery">Out for delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <MdKeyboardArrowDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none 
                                                    ${order.status === "Cancelled" ? "text-red-400" :
                                                        order.status === "Delivered" ? "text-green-400" :
                                                            "text-orange-400"}`}
                                                />
                                            </div>

                                            {order.status === "Out for delivery" && (
                                                <div className='flex items-center gap-2 p-1.5 bg-orange-100/50 rounded-xl animate-fadeIn'>
                                                    <input
                                                        type="text"
                                                        placeholder="OTP"
                                                        className='w-16 p-2 bg-white border border-orange-200 rounded-lg text-center font-black text-xs outline-none focus:border-orange-500 shadow-sm'
                                                        value={otpInputs[order._id] || ""}
                                                        onChange={(e) => setOtpInputs({ ...otpInputs, [order._id]: e.target.value })}
                                                        maxLength={4}
                                                    />
                                                    <button
                                                        onClick={() => verifyOtpHandler(order._id)}
                                                        className='flex-1 bg-orange-500 text-white py-2 rounded-lg font-black text-[10px] hover:bg-orange-600 transition-all active:scale-95'
                                                    >
                                                        Verify
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Orders
