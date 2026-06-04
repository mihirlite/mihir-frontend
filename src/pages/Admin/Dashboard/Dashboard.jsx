import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineShoppingCart, MdToday, MdPeopleOutline, MdCheckCircle, MdAttachMoney, MdCalendarMonth, MdOutlineRestaurant, MdRiceBowl, MdKebabDining, MdSearch } from 'react-icons/md';
import { BiCalendarHeart, BiLoaderAlt } from 'react-icons/bi';

const Dashboard = ({ url, token }) => {
    const [data, setData] = useState({
        totalOrders: 0,
        todayOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalMonthlySubs: 0,
        totalHalfMonthlySubs: 0,
        todayLunchVegCount: 0,
        todayLunchNonVegCount: 0,
        todayDinnerVegCount: 0,
        todayDinnerNonVegCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [dailyCustomers, setDailyCustomers] = useState([]);
    const [dailyLoading, setDailyLoading] = useState(true);
    const [otp, setOtp] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [verifyingId, setVerifyingId] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(url + "/api/order/dashboard", { headers: { token } });
            if (response.data.success) {
                setData(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch dashboard data");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching dashboard data");
        } finally {
            setLoading(false);
        }
    }

    const fetchDailyCustomers = async () => {
        setDailyLoading(true);
        try {
            const response = await axios.get(url + "/api/order/daily-customers", { headers: { token } });
            if (response.data.success) {
                setDailyCustomers(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDailyLoading(false);
        }
    }

    const handleOtpSearch = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            return toast.warn("Please enter a valid 4-digit OTP");
        }

        setSearchLoading(true);
        setSearchResult([]);
        try {
            const response = await axios.post(url + "/api/order/find-by-otp", { otp }, { headers: { token } });
            if (response.data.success) {
                setSearchResult(response.data.data);
            } else {
                toast.info(response.data.message || "No orders found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error searching OTP");
        } finally {
            setSearchLoading(false);
        }
    }

    const handleVerifyOtp = async (orderId) => {
        setVerifyingId(orderId);
        try {
            const response = await axios.post(url + "/api/order/verify-otp", { orderId, otp }, { headers: { token } });
            if (response.data.success) {
                toast.success("Order Verified & Delivered!");
                setSearchResult(prev => prev.filter(item => item._id !== orderId));
                fetchDashboardData(); // Refresh stats
                if (otp && searchResult.length <= 1) {
                    setOtp('');
                }
            } else {
                toast.error(response.data.message || "Verification failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during verification");
        } finally {
            setVerifyingId(null);
        }
    }

    useEffect(() => {
        if (token) {
            fetchDashboardData();
            fetchDailyCustomers();
        }
    }, [token]);

    const primaryCards = [
        { title: "Total Orders", value: data.totalOrders, icon: <MdOutlineShoppingCart size={24} />, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Today's Orders", value: data.todayOrders, icon: <MdToday size={24} />, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Total Users", value: data.totalUsers, icon: <MdPeopleOutline size={24} />, color: "text-green-600", bg: "bg-green-50" },
        { title: "Total Revenue", value: `₹${data.totalRevenue}`, icon: <MdAttachMoney size={24} />, color: "text-purple-600", bg: "bg-purple-50" }
    ];

    const subCards = [
        { title: "Total Monthly Subs", value: data.totalMonthlySubs, icon: <MdCalendarMonth size={24} />, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "Total Half-Monthly Subs", value: data.totalHalfMonthlySubs, icon: <BiCalendarHeart size={24} />, color: "text-pink-600", bg: "bg-pink-50" },
    ];

    const mealCards = [
        { title: "Today's Lunch Veg", value: data.todayLunchVegCount, icon: <MdRiceBowl size={24} />, color: "text-emerald-700", bg: "bg-emerald-100" },
        { title: "Today's Lunch Non-Veg", value: data.todayLunchNonVegCount, icon: <MdKebabDining size={24} />, color: "text-rose-700", bg: "bg-rose-100" },
        { title: "Today's Dinner Veg", value: data.todayDinnerVegCount, icon: <MdRiceBowl size={24} />, color: "text-emerald-700", bg: "bg-emerald-100" },
        { title: "Today's Dinner Non-Veg", value: data.todayDinnerNonVegCount, icon: <MdKebabDining size={24} />, color: "text-rose-700", bg: "bg-rose-100" }
    ];

    return (
        <div className='animate-fadeIn w-full'>
            <div className='mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Dashboard Overview</h3>
                    <p className='text-sm text-gray-500 font-medium'>Key performance indicators and statistics</p>
                </div>

                <div className='bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full md:w-96'>
                    <form onSubmit={handleOtpSearch} className='flex items-center gap-2'>
                        <div className='relative flex-1'>
                            <MdSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                            <input 
                                type="text" 
                                placeholder="Search Customer OTP..." 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none font-medium'
                            />
                        </div>
                        <button 
                            disabled={searchLoading}
                            className='bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0'
                        >
                            {searchLoading ? <BiLoaderAlt className='animate-spin' /> : "Search"}
                        </button>
                    </form>
                </div>
            </div>

            {searchResult.length > 0 && (
                <div className='mb-8 animate-fadeIn'>
                    <div className='flex items-center gap-2 mb-4'>
                        <div className='w-2 h-8 bg-orange-500 rounded-full'></div>
                        <h4 className='text-xl font-black text-gray-800'>Matching Orders</h4>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {searchResult.map((order) => (
                            <div key={order._id} className='bg-white p-5 rounded-2xl border-2 border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span className='text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md uppercase tracking-tighter'>Order #{order._id.slice(-6)}</span>
                                        <span className='text-[10px] font-bold text-gray-400'>•</span>
                                        <span className='text-xs font-bold text-gray-600'>{order.address.firstName} {order.address.lastName}</span>
                                    </div>
                                    <p className='text-lg font-black text-gray-800'>₹{order.amount}</p>
                                    <p className='text-xs font-medium text-gray-500'>{order.items.length} items • {order.status}</p>
                                </div>
                                <button 
                                    onClick={() => handleVerifyOtp(order._id)}
                                    disabled={verifyingId === order._id}
                                    className='w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-95'
                                >
                                    {verifyingId === order._id ? <BiLoaderAlt className='animate-spin' size={18} /> : <MdCheckCircle size={18} />}
                                    Verify & Deliver
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-50 animate-pulse h-24 rounded-2xl border border-gray-100"></div>)}
                    </div>
                </div>
            ) : (
                <div className="space-y-8 w-full">
                    
                    {/* Primary Stats Row 1 & 2 */}
                    <div className="flex flex-col xl:flex-row gap-8">
                        <div className="flex-1 space-y-8">
                            {/* Primary Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6">
                                {primaryCards.map((card, index) => (
                                    <div key={index} className="bg-white p-4 sm:p-5 lg:p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex items-center gap-3 sm:gap-4 group overflow-hidden">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                            {card.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 leading-tight">{card.title}</p>
                                            <h4 className="text-xl sm:text-2xl xl:text-2xl 2xl:text-3xl font-black text-gray-800 tracking-tighter truncate">{card.value}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent w-full' />

                            {/* Subscription & Meal Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* Subs Column */}
                                <div className="space-y-6">
                                    <div className='flex items-center gap-3 mb-2 px-2'>
                                        <div className='w-1 h-6 bg-indigo-500 rounded-full' />
                                        <h4 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                            <MdCalendarMonth className="text-indigo-500" /> Subscriptions
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
                                        {subCards.map((card, index) => (
                                            <div key={index} className="bg-white p-4 sm:p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group overflow-hidden">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                                    {card.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5 leading-tight">{card.title}</p>
                                                    <h4 className="text-lg sm:text-xl font-black text-gray-800 truncate">{card.value}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Meals Column */}
                                <div className="space-y-6">
                                    <div className='flex items-center gap-3 mb-2 px-2'>
                                        <div className='w-1 h-6 bg-orange-500 rounded-full' />
                                        <h4 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                            <MdOutlineRestaurant className="text-orange-500" /> Today's Meals
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
                                        {mealCards.map((card, index) => (
                                            <div key={index} className="bg-white p-4 sm:p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group overflow-hidden">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                                    {card.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5 leading-tight">{card.title}</p>
                                                    <h4 className="text-lg sm:text-xl font-black text-gray-800 truncate">{card.value}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DAILY CUSTOMERS SIDEBAR */}
                        <div className="w-full xl:w-80 shrink-0">
                            <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm h-full flex flex-col">
                                <div className='flex items-center justify-between mb-8'>
                                    <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                        <MdPeopleOutline className="text-blue-500" /> Daily Orders
                                    </h4>
                                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-tighter border border-blue-100">Last 7 Days</span>
                                </div>
                                
                                {dailyLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl"></div>)}
                                    </div>
                                ) : dailyCustomers.length > 0 ? (
                                    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                        {dailyCustomers.map((user, index) => (
                                            <div key={user._id} className="group relative bg-gray-50/50 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-lg transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-black text-gray-800 truncate">{user.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 truncate">{user.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-black text-blue-600">{user.orderDaysCount}</span>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Days</p>
                                                    </div>
                                                </div>
                                                {user.orderDaysCount >= 7 && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                                                            <MdCheckCircle size={12} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                            <MdPeopleOutline size={32} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 px-4">No daily customers identified in the last 7 days yet.</p>
                                    </div>
                                )}
                                
                                <div className="mt-8 pt-6 border-t border-gray-50">
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest text-center">Identifying fans who order every day</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Dashboard;
