import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdOutlineLocalShipping, MdOutlineContactPhone, MdKeyboardArrowDown, MdRefresh, MdSearch, MdClose } from "react-icons/md";

const TodayOrders = ({ url, token, role = 'admin' }) => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});
    const [filterType, setFilterType] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [otpSearch, setOtpSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [localStatuses, setLocalStatuses] = useState({});

    const fetchTodayOrders = async () => {
        try {
            const response = await axios.get(url + "/api/order/list", { headers: { token } });
            if (response.data.success) {
                setOtpSearch(""); // Reset OTP search when manually refreshing
                const todayOrdersFiltered = response.data.data || []; // Backend now filters for today AND status if role is delivery
                
                // If admin, we still filter for today on frontend for this specific component
                if (role === 'admin') {
                    const startOfToday = new Date();
                    startOfToday.setHours(0, 0, 0, 0);
                    const endOfToday = new Date();
                    endOfToday.setHours(23, 59, 59, 999);

                    const adminFiltered = (todayOrdersFiltered || []).filter(order => {
                        const orderDate = new Date(order.date);
                        const isToday = orderDate >= startOfToday && orderDate <= endOfToday;
                        const hasSubscription = order.items.some(item => item.subscription && item.subscription.orderType !== 'today');
                        return isToday && !hasSubscription;
                    });
                    setOrders(adminFiltered.reverse());
                } else {
                    setOrders(todayOrdersFiltered.reverse());
                }
            } else {
                toast.error("Error fetching today's orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching today's orders");
        }
    }

    const handleOtpSearch = async (e) => {
        const val = e.target.value;
        setOtpSearch(val);
        
        if (val.length === 4) {
            setIsSearching(true);
            try {
                const response = await axios.post(url + "/api/order/find-by-otp", { otp: val }, { headers: { token } });
                if (response.data.success && response.data.data.length > 0) {
                    setOrders(response.data.data);
                    toast.success(`Found ${response.data.data.length} order(s)`);
                } else {
                    toast.info("No active orders found with this OTP");
                }
            } catch (error) {
                console.error("OTP Search Error:", error);
                toast.error("Search failed");
            } finally {
                setIsSearching(false);
            }
        } else if (val.length === 0) {
            fetchTodayOrders();
        }
    }

    const statusHandler = async (orderId, status) => {
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: status
            }, { headers: { token } })
            if (response.data.success) {
                toast.success("Status Updated Successfully");
                setLocalStatuses(prev => {
                    const newState = { ...prev };
                    delete newState[orderId];
                    return newState;
                });
                await fetchTodayOrders();
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
                await fetchTodayOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
    }

    useEffect(() => {
        fetchTodayOrders();
    }, [])

    const filteredOrders = (orders || []).filter(order => {
        // 1. Meal Preference Filter
        let matchesMealPref = true;
        if (filterType === 'Veg') {
            matchesMealPref = order.items.some(item => item.veg === true || (item.name && item.name.toLowerCase().includes('veg') && !item.name.toLowerCase().includes('non')));
        } else if (filterType === 'Non-Veg') {
            matchesMealPref = order.items.some(item => item.veg === false || (item.name && item.name.toLowerCase().includes('non-veg')));
        }

        // 2. Status Filter
        let matchesStatus = true;
        if (statusFilter !== 'All') {
            matchesStatus = order.status === statusFilter;
        }

        return matchesMealPref && matchesStatus;
    });

    const getMealPreference = (items) => {
        const hasVeg = items.some(item => item.veg === true || (item.name && item.name.toLowerCase().includes('veg') && !item.name.toLowerCase().includes('non')));
        const hasNonVeg = items.some(item => item.veg === false || (item.name && item.name.toLowerCase().includes('non-veg')));

        if (hasVeg && hasNonVeg) return "Both";
        if (hasVeg) return "Veg";
        if (hasNonVeg) return "Non-Veg";
        return "";
    };

    return (
        <div className='animate-fadeIn'>
            <div className='mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Today's Orders</h3>
                    <p className='text-sm text-gray-500 font-medium'>Monitor orders placed today</p>
                </div>

                <div className='flex-1 max-w-md mx-4'>
                    <div className='relative group'>
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${otpSearch ? 'text-orange-500' : 'text-gray-400'}`}>
                            <MdSearch size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by OTP (4 digits)..."
                            value={otpSearch}
                            onChange={handleOtpSearch}
                            maxLength={4}
                            className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-2xl font-black text-sm outline-none transition-all shadow-sm
                                ${otpSearch ? 'border-orange-500 ring-4 ring-orange-50' : 'border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-50'}
                            `}
                        />
                        {isSearching && (
                            <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                                <div className='w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
                            </div>
                        )}
                        {otpSearch && !isSearching && (
                            <button 
                                onClick={() => fetchTodayOrders()}
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors'
                            >
                                <MdClose size={20} />
                            </button>
                        )}
                    </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-3'>
                        <div className='relative'>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className='w-full appearance-none flex items-center gap-2 px-6 pr-10 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 outline-none focus:border-orange-500 cursor-pointer text-sm'
                            >
                                <option value="All">All Status</option>
                                <option value="Food Processing">Preparing</option>
                                <option value="Out for delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <MdKeyboardArrowDown className='absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none' />
                        </div>

                        <div className='relative'>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className='w-full appearance-none flex items-center gap-2 px-6 pr-10 py-3 bg-white border-2 border-green-100 text-green-600 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-sm active:scale-95 outline-none focus:border-green-500 cursor-pointer text-sm'
                            >
                                <option value="All">All Diets</option>
                                <option value="Veg">Veg Only</option>
                                <option value="Non-Veg">Non-Veg Only</option>
                            </select>
                            <MdKeyboardArrowDown className='absolute right-3 top-1/2 -translate-y-1/2 text-xl text-green-400 pointer-events-none' />
                        </div>

                        <button
                            onClick={fetchTodayOrders}
                            className='flex items-center gap-2 px-6 py-3 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all shadow-sm active:scale-95 text-sm'
                        >
                            <MdRefresh size={20} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm bg-white">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Customer</th>
                            <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Items</th>
                            <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Location</th>
                            <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Payment</th>
                            <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap font-black'>Amount</th>
                            <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Status</th>
                            {role === 'admin' && <th className='px-4 sm:px-6 py-5 text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Action</th>}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={role === 'admin' ? "6" : "5"} className='px-6 py-12 text-center text-gray-400 font-medium'>
                                    {orders.length === 0 ? "No orders for today yet." : "No orders found matching this filter."}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order, index) => {
                                const currentStatus = localStatuses[order._id] || order.status;
                                return (
                                    <tr key={index} className='hover:bg-orange-50/30 transition-colors group'>
                                        <td className='px-4 sm:px-6 py-5'>
                                            <div className="min-w-0">
                                                <p className='font-bold text-gray-800 truncate'>{order.address?.firstName} {order.address?.lastName}</p>
                                                <p className='text-xs text-gray-400 font-medium truncate'>{order.address?.phone}</p>
                                            </div>
                                        </td>
                                        <td className='px-4 sm:px-6 py-5'>
                                            <div className='max-w-[180px]'>
                                            {order.items.map((item, i) => {
                                                const isAddon = item.isComboAddon || item.category === 'Specific-Addon';
                                                return (
                                                    <div key={i} className={`flex items-center gap-1 mb-1 last:mb-0 ${isAddon ? 'pl-2 border-l-2 border-orange-300' : ''}`}>
                                                        {isAddon && (
                                                            <span className='text-[9px] font-black bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0'>+Extra</span>
                                                        )}
                                                        <p className={`text-xs font-bold truncate ${isAddon ? 'text-orange-600' : 'text-gray-600'}`}>
                                                            {item.quantity} x {item.name}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        </td>
                                        <td className='px-4 sm:px-6 py-5'>
                                            <p className='text-xs text-gray-600 font-medium line-clamp-2'>
                                                {order.address?.address}, {order.address?.city}
                                            </p>
                                        </td>
                                        <td className='px-4 sm:px-6 py-5 text-center'>
                                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-full whitespace-nowrap border
                                                ${order.payment ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}
                                            >
                                                {order.payment ? "PAID" : "COD/UNPAID"}
                                            </span>
                                        </td>
                                        <td className='px-4 sm:px-6 py-5'>
                                            <p className='font-black text-gray-900'>₹{order.amount}</p>
                                        </td>
                                        <td className='px-6 py-5'>
                                            <div className='flex flex-col gap-2 min-w-[170px]'>
                                                <div className='relative'>
                                                    {role === 'admin' ? (
                                                        <>
                                                            <select
                                                                onChange={(e) => setLocalStatuses({ ...localStatuses, [order._id]: e.target.value })}
                                                                value={currentStatus}
                                                                disabled={order.status === "Cancelled"}
                                                                className={`w-full appearance-none border-2 font-black py-2.5 px-4 rounded-xl outline-none transition-all text-sm ${order.status === "Cancelled" ? "cursor-not-allowed" : "cursor-pointer"}
                                                                ${currentStatus === "Cancelled" ? "bg-red-50 border-red-100 text-red-600 focus:border-red-500" :
                                                                        currentStatus === "Delivered" ? "bg-green-50 border-green-100 text-green-600 focus:border-green-500" :
                                                                            "bg-orange-50 border-orange-100 text-orange-600 focus:border-orange-500"}
                                                            `}
                                                            >
                                                                <option value="Food Processing">Preparing</option>
                                                                <option value="Out for delivery">Out for delivery</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                            <MdKeyboardArrowDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none 
                                                            ${currentStatus === "Cancelled" ? "text-red-400" :
                                                                    currentStatus === "Delivered" ? "text-green-400" :
                                                                        "text-orange-400"}`}
                                                            />
                                                        </>
                                                    ) : (
                                                        <span className='px-4 py-2 bg-orange-50 border border-orange-100 text-orange-600 rounded-xl font-black text-sm block text-center'>
                                                            Out for delivery
                                                        </span>
                                                    )}
                                                </div>

                                                {(role === 'delivery' || (role === 'admin' && currentStatus !== "Delivered" && currentStatus !== "Cancelled")) && (
                                                    <div className='mt-2 p-3 bg-orange-50 border border-orange-100 rounded-2xl animate-fadeIn'>
                                                        <p className='text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-1'>
                                                            <span className='w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse'></span>
                                                            Verify OTP to Deliver
                                                        </p>
                                                        <div className='flex items-center gap-2'>
                                                            <input
                                                                type="text"
                                                                placeholder="0000"
                                                                className='flex-1 w-16 p-2 bg-white border-2 border-orange-100 rounded-xl text-center font-black text-sm outline-none focus:border-orange-500 shadow-sm transition-all'
                                                                value={otpInputs[order._id] || ""}
                                                                onChange={(e) => setOtpInputs({ ...otpInputs, [order._id]: e.target.value })}
                                                                maxLength={4}
                                                            />
                                                            <button
                                                                onClick={() => verifyOtpHandler(order._id)}
                                                                className='px-3 py-2 bg-orange-500 text-white rounded-xl font-black text-xs hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-orange-100'
                                                            >
                                                                Verify
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        {role === 'admin' && (
                                            <td className='px-6 py-5 text-center'>
                                                <button
                                                    onClick={() => statusHandler(order._id, currentStatus)}
                                                    disabled={currentStatus === order.status || order.status === "Cancelled"}
                                                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 border-2
                                                    ${currentStatus !== order.status && order.status !== "Cancelled"
                                                            ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 shadow-orange-200'
                                                            : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'}`}
                                                >
                                                    Save
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TodayOrders
