import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdOutlineLocalShipping, MdOutlineContactPhone, MdCheckCircle, MdClose, MdRefresh, MdLocationOn, MdFastfood } from "react-icons/md";

const TodayMonthlyDelivery = ({ url, token }) => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otpInputs, setOtpInputs] = useState({});
    const [mealTimeFilter, setMealTimeFilter] = useState(() => {
        const hour = new Date().getHours();
        return hour < 15 ? 'Lunch' : 'Dinner'; // Before 3 PM default to Lunch
    });

    const fetchTodayDeliveries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/order/today-monthly?mealTime=${mealTimeFilter}`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setDeliveries(response.data.data);
            } else {
                toast.error("Error fetching deliveries");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    }

    const markDelivery = async (orderId, scheduleId, mealType, status) => {
        try {
            const response = await axios.post(url + "/api/order/mark-monthly-delivery", {
                orderId,
                scheduleId,
                mealTime: mealType,
                status
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.success) {
                toast.success(`Marked as ${status}`);
                fetchTodayDeliveries();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating delivery status");
        }
    }

    const verifyOtpHandler = async (orderId, scheduleId, mealType) => {
        const otp = otpInputs[scheduleId || orderId];
        if (!otp || otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }

        try {
            // Reusing existing OTP verify but with meal marking logic
            const response = await axios.post(url + "/api/order/verify-otp", {
                orderId,
                otp
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.success) {
                // Now mark the specific meal as delivered
                await markDelivery(orderId, scheduleId, mealType, "Delivered");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
    }

    useEffect(() => {
        fetchTodayDeliveries();
    }, [mealTimeFilter])

    return (
        <div className='animate-fadeIn p-2 md:p-4'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Today's Monthly Delivery</h3>
                    <p className='text-sm text-gray-500 font-medium'>Daily subscription operations - {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className='flex items-center gap-3 bg-white p-1.5 rounded-2xl border-2 border-gray-100 shadow-sm'>
                    <button
                        onClick={() => setMealTimeFilter('Lunch')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${mealTimeFilter === 'Lunch' ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        LUNCH
                    </button>
                    <button
                        onClick={() => setMealTimeFilter('Dinner')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${mealTimeFilter === 'Dinner' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        DINNER
                    </button>
                </div>

                <button
                    onClick={fetchTodayDeliveries}
                    className='flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95'
                >
                    <MdRefresh size={20} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm bg-white">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider'>Customer</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider text-center'>Meal</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider text-center'>Meal Type</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider'>Address/Location</th>
                            <th className='px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {deliveries.length === 0 ? (
                            <tr>
                                <td colSpan="5" className='px-6 py-12 text-center text-gray-400 font-medium'>
                                    {loading ? "Loading deliveries..." : `No pending ${mealTimeFilter} deliveries found.`}
                                </td>
                            </tr>
                        ) : (
                            deliveries.map((delivery, index) => (
                                <tr key={delivery.scheduleId || `${delivery._id}-${delivery.mealType}`} className='hover:bg-orange-50/30 transition-colors group'>
                                    <td className='px-6 py-5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0 shadow-sm'>
                                                {(delivery.customerName || 'U')[0]}
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-800'>{delivery.customerName || 'User'}</p>
                                                <div className='flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-0.5'>
                                                    <MdOutlineContactPhone size={14} className='text-gray-400' />
                                                    {delivery.phone || 'No Phone'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5 text-center'>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 ${delivery.mealType === 'Lunch' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                            {delivery.mealType}
                                        </span>
                                    </td>
                                    <td className='px-6 py-5 text-center'>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 ${delivery.foodPreference === 'Veg' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                            {delivery.foodPreference}
                                        </span>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div className='flex items-start gap-2 max-w-[250px]'>
                                            <MdLocationOn className='text-gray-400 mt-1 shrink-0' />
                                            <p className='text-sm text-gray-600 font-medium leading-relaxed'>
                                                {delivery.address?.address || 'No Address'}, {delivery.address?.city || ''}
                                            </p>
                                        </div>
                                    </td>
                                    <td className='px-6 py-5'>
                                        <div className='flex flex-col gap-3 min-w-[200px]'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => markDelivery(delivery.orderId || delivery._id, delivery.scheduleId, delivery.mealType, "Delivered")}
                                                    className='flex-1 py-2.5 bg-green-600 text-white rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-green-700 transition-all active:scale-95 shadow-md shadow-green-100 flex items-center justify-center gap-2'
                                                >
                                                    <MdCheckCircle size={16} />
                                                    Deliver
                                                </button>
                                                <button
                                                    onClick={() => markDelivery(delivery.orderId || delivery._id, delivery.scheduleId, delivery.mealType, "Failed")}
                                                    className='py-2.5 px-4 bg-red-50 text-red-600 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-red-100 transition-all active:scale-95'
                                                >
                                                    Fail
                                                </button>
                                            </div>

                                            {/* OTP Verification Section */}
                                            <div className='p-3 bg-gray-50 border border-gray-100 rounded-2xl'>
                                                <p className='text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2'>Secure OTP Verification</p>
                                                <div className='flex items-center gap-2'>
                                                    <input
                                                        type="text"
                                                        placeholder="0000"
                                                        className='flex-1 w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-black text-sm outline-none focus:border-orange-500'
                                                        value={otpInputs[delivery.scheduleId || delivery._id] || ""}
                                                        onChange={(e) => setOtpInputs({ ...otpInputs, [delivery.scheduleId || delivery._id]: e.target.value })}
                                                        maxLength={4}
                                                    />
                                                    <button
                                                        onClick={() => verifyOtpHandler(delivery.orderId || delivery._id, delivery.scheduleId, delivery.mealType)}
                                                        className='px-3 py-2 bg-orange-600 text-white rounded-lg font-black text-[10px] uppercase hover:bg-orange-700 transition-all'
                                                    >
                                                        Verify
                                                    </button>
                                                </div>
                                            </div>
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

export default TodayMonthlyDelivery
