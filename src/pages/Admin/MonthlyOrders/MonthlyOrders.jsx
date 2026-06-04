import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdOutlineLocalShipping, MdOutlineContactPhone, MdKeyboardArrowDown, MdRefresh, MdAdd, MdClose, MdCalendarToday, MdCheckCircle, MdRestaurantMenu, MdRemove, MdLocationOn } from "react-icons/md";

const MonthlyOrders = ({ url, token }) => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});
    const [filterType, setFilterType] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [localStatuses, setLocalStatuses] = useState({});
    const [expandedRows, setExpandedRows] = useState({}); // {orderId: boolean}

    // Admin Add Customer Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [verifyEmailInput, setVerifyEmailInput] = useState("");
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [subscriptionPrices, setSubscriptionPrices] = useState([]);
    const [newSub, setNewSub] = useState({
        plan: "30_days",
        mealTiming: "Lunch",
        mealPreference: "Veg",
        quantity: 1,
        address: "Naraj Depot",
        phone: "",
        discount: ""
    });

    // Auto-computed amount
    const [calculatedAmount, setCalculatedAmount] = useState(0);

    const fetchSubscriptionPrices = async () => {
        try {
            const response = await axios.get(url + "/api/subscription/get");
            if (response.data.success) {
                setSubscriptionPrices(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching subscription prices", error);
        }
    };

    const fetchMonthlyOrders = async () => {
        try {
            const response = await axios.get(url + "/api/order/list", { headers: { token } });
            if (response.data.success) {
                const monthlyOrdersFiltered = (response.data.data || []).filter(order => {
                    // Check if any item in the order has a subscription property
                    return (order.items || []).some(item => item && item.subscription && item.subscription.orderType !== 'today');
                });

                setOrders(monthlyOrdersFiltered.reverse());
            } else {
                toast.error("Error fetching monthly orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching monthly orders");
        }
    }

    const statusHandler = async (orderId, status) => {
        try {
            const endpoint = ["Ongoing", "Paused", "Completed", "Cancelled"].includes(status) 
                ? "/api/order/update-subscription-status"
                : "/api/order/status";
            
            const response = await axios.post(url + endpoint, {
                orderId,
                status: status
            }, { headers: { Authorization: `Bearer ${token}` } })
            
            if (response.data.success) {
                toast.success("Status Updated Successfully");
                setLocalStatuses(prev => {
                    const newState = { ...prev };
                    delete newState[orderId];
                    return newState;
                });
                await fetchMonthlyOrders();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status");
        }
    }

    const markDailyDelivery = async (orderId, mealTime) => {
        try {
            const response = await axios.post(url + "/api/order/mark-daily-delivery", {
                orderId,
                mealTime
            }, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchMonthlyOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error marking daily delivery");
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
                await fetchMonthlyOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
    }

    useEffect(() => {
        fetchMonthlyOrders();
        fetchSubscriptionPrices();
    }, [])

    useEffect(() => {
        const matchingRule = (subscriptionPrices || []).find(
            rule => rule.plan === newSub.plan &&
                rule.mealTiming === newSub.mealTiming &&
                rule.mealPreference === newSub.mealPreference
        );

        if (matchingRule) {
            setCalculatedAmount(matchingRule.price * newSub.quantity);
        } else {
            setCalculatedAmount(0);
        }
    }, [newSub, subscriptionPrices]);

    const handleVerifyEmail = async () => {
        if (!verifyEmailInput) return toast.error("Enter an email first");
        try {
            const response = await axios.post(url + "/api/user/verify-email", { email: verifyEmailInput }, { headers: { token } });
            if (response.data.success) {
                setVerifiedUser(response.data.user);
                setNewSub(prev => ({ ...prev, phone: response.data.user.phone || "" }));
                toast.success("User verified successfully");
            } else {
                toast.error(response.data.message);
                setVerifiedUser(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying user");
        }
    };

    const handleAdminPlaceOrder = async () => {
        if (!verifiedUser) return toast.error("Please verify a user first.");
        if (calculatedAmount === 0) return toast.error("Invalid subscription configuration or price is 0.");

        const discountPercentage = Number(newSub.discount) || 0;
        const finalAmount = Math.max(0, discountPercentage > 0 
            ? calculatedAmount - (calculatedAmount * discountPercentage / 100)
            : calculatedAmount);

        try {
            let itemsPayload = [];

            if (newSub.mealPreference === "Veg" || newSub.mealPreference === "Both") {
                itemsPayload.push({
                    name: "Veg Thali",
                    price: finalAmount / newSub.quantity, // Approximation of unit price for receipt
                    quantity: newSub.quantity,
                    subscription: {
                        orderType: newSub.plan,
                        mealTime: newSub.mealTiming,
                        mealType: newSub.mealPreference
                    }
                });
            }

            if (newSub.mealPreference === "Non-Veg") {
                itemsPayload.push({
                    name: "Non-Veg Thali",
                    price: finalAmount / newSub.quantity,
                    quantity: newSub.quantity,
                    subscription: {
                        orderType: newSub.plan,
                        mealTime: newSub.mealTiming,
                        mealType: newSub.mealPreference
                    }
                });
            }

            if (itemsPayload.length === 0) return toast.error("Add at least 1 thali count.");

            const payload = {
                userId: verifiedUser._id,
                items: itemsPayload,
                amount: finalAmount,
                address: {
                    ...(verifiedUser.address || { firstName: verifiedUser.name?.split(' ')[0] || "Admin", lastName: verifiedUser.name?.split(' ').slice(1).join(' ') || "Added", city: "", state: "" }),
                    address: newSub.address,
                    phone: newSub.phone || verifiedUser.phone || "No Phone"
                }
            };

            const response = await axios.post(url + "/api/order/admin-place", payload, { headers: { token } });

            if (response.data.success) {
                toast.success("Subscription order placed successfully.");
                setShowAddModal(false);
                setVerifyEmailInput("");
                setVerifiedUser(null);
                setNewSub({
                    plan: "30_days",
                    mealTiming: "Lunch",
                    mealPreference: "Veg",
                    quantity: 1,
                    address: "Naraj Depot",
                    phone: "",
                    discount: ""
                });
                await fetchMonthlyOrders();
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("Error placing admin order");
        }
    };

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
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Monthly Orders</h3>
                    <p className='text-sm text-gray-500 font-medium'>Monitor active subscription orders</p>
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
                            onClick={() => setShowAddModal(true)}
                            className='flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-sm active:scale-95 shadow-orange-200 text-sm'
                        >
                            <MdAdd size={20} />
                            Add Customer
                        </button>
                    </div>
                    <p className='text-xs font-black text-gray-500 px-2'>
                        Total Orders: <span className='text-orange-600'>{filteredOrders.length}</span>
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm bg-white">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Customer</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Date</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>15D</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>30D</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>L</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>D</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Pref.</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Location</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Pay</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap'>Amt</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Prog.</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Status</th>
                            <th className='px-3 sm:px-6 py-5 text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider whitespace-nowrap text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="14" className='px-6 py-12 text-center text-gray-400 font-medium'>
                                    {orders.length === 0 ? "No monthly subscriptions active yet." : "No orders found matching this filter."}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order, index) => {
                                 const currentStatus = localStatuses[order._id] || order.subscriptionStatus || order.status;
                                 const isExpanded = expandedRows[order._id] || false;

                                 // Extract subscription details by scanning items
                                 let isHalfMonthly = false;
                                 let isMonthly = false;
                                 let isLunch = false;
                                 let isDinner = false;
                                 let vegCount = 0;
                                 let nonVegCount = 0;

                                 order.items.forEach(item => {
                                     if (item.subscription && item.subscription.orderType !== 'today') {
                                         if (item.subscription.orderType === '15 Days' || item.subscription.orderType === '15_days') isHalfMonthly = true;
                                         if (item.subscription.orderType === '30 Days' || item.subscription.orderType === '30_days') isMonthly = true;

                                         if (item.subscription.mealTime === 'Lunch') isLunch = true;
                                         if (item.subscription.mealTime === 'Dinner') isDinner = true;
                                         if (item.subscription.mealTime === 'Both') {
                                             isLunch = true;
                                             isDinner = true;
                                         }

                                         if (item.subscription.mealType === 'Veg') vegCount += item.quantity;
                                         if (item.subscription.mealType === 'Non-Veg') nonVegCount += item.quantity;
                                         if (item.subscription.mealType === 'Both') {
                                             // Approximation since actual specific split isn't explicitly captured in simple setup
                                             vegCount += item.quantity;
                                             nonVegCount += item.quantity;
                                         }
                                     }
                                 });

                                 return (
                                     <React.Fragment key={order._id}>
                                         <tr 
                                             onClick={() => setExpandedRows(prev => ({ ...prev, [order._id]: !isExpanded }))}
                                             className='hover:bg-orange-50/30 transition-colors group cursor-pointer'
                                         >
                                             <td className='px-3 sm:px-6 py-5'>
                                                 <div className='flex items-center gap-3'>
                                                     <div className='w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0 uppercase'>
                                                         {order.address?.firstName?.[0] || 'U'}{order.address?.lastName?.[0] || ''}
                                                     </div>
                                                     <div className="min-w-0">
                                                         <p className='font-bold text-gray-800 whitespace-nowrap truncate'>{order.address?.firstName || 'Unknown'} {order.address?.lastName || 'User'}</p>
                                                         <p className='text-[10px] text-gray-400 font-medium truncate'>{order.address?.phone || 'No Phone'}</p>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 <div className='flex flex-col items-center justify-center'>
                                                     <p className='text-xs sm:text-sm font-black text-gray-800 whitespace-nowrap'>
                                                         {new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                     </p>
                                                     <p className='text-[10px] font-bold text-gray-500 whitespace-nowrap'>
                                                         {new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                     </p>
                                                 </div>
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 {isHalfMonthly ? <span className="text-green-500 font-black text-lg">✓</span> : <span className="text-gray-300">-</span>}
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 {isMonthly ? <span className="text-green-500 font-black text-lg">✓</span> : <span className="text-gray-300">-</span>}
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 {isLunch ? <span className="text-green-500 font-black text-lg">✓</span> : <span className="text-gray-300">-</span>}
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 {isDinner ? <span className="text-green-500 font-black text-lg">✓</span> : <span className="text-gray-300">-</span>}
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 <span className={`px-2 py-1 rounded-full text-[10px] font-black whitespace-nowrap border
                                                     ${vegCount > 0 && nonVegCount > 0 ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                         vegCount > 0 ? 'bg-green-50 text-green-600 border-green-200' :
                                                         nonVegCount > 0 ? 'bg-red-50 text-red-600 border-red-200' :
                                                         'bg-gray-50 text-gray-400 border-gray-200'}`}
                                                 >
                                                     {vegCount > 0 && nonVegCount > 0 ? 'Both' : vegCount > 0 ? 'Veg' : nonVegCount > 0 ? 'N-Veg' : '-'}
                                                 </span>
                                             </td>
                                             <td className='px-3 sm:px-6 py-5'>
                                                 <p className='text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-[120px] sm:max-w-[200px] line-clamp-2'>
                                                     {order.address?.address || 'N/A'}, {order.address?.city || ''}, {order.address?.state || ''}
                                                 </p>
                                             </td>
                                             <td className='px-3 sm:px-6 py-5 text-center'>
                                                 <span className={`px-2.5 py-1 text-[10px] font-black rounded-full whitespace-nowrap border
                                                 ${order.payment ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}
                                                 >
                                                     {order.payment ? "PAID" : "PENDING"}
                                                 </span>
                                             </td>
                                             <td className='px-3 sm:px-6 py-5'>
                                                 <p className='text-lg sm:text-xl font-black text-gray-900'>₹{order.amount}</p>
                                             </td>
                                             <td className='px-6 py-5 text-center'>
                                                 <div className='flex flex-col items-center gap-1 group/history relative cursor-help'>
                                                     <p className='text-sm font-black text-gray-800'>
                                                        {[...new Set((order.deliveryHistory || []).filter(h => h.status === 'Delivered').map(h => new Date(h.date).toDateString()))].length} / {isMonthly ? 30 : 15}
                                                     </p>
                                                     <p className='text-[10px] font-bold text-gray-400 uppercase'>Days</p>
                                                 </div>
                                             </td>
                                             <td className='px-6 py-5'>
                                                 <div className='flex flex-col gap-2 min-w-[140px]'>
                                                     <div className='relative' onClick={(e) => e.stopPropagation()}>
                                                         <select
                                                             onChange={(e) => setLocalStatuses({ ...localStatuses, [order._id]: e.target.value })}
                                                             value={currentStatus}
                                                             disabled={(order.subscriptionStatus || order.status) === "Cancelled"}
                                                             className={`w-full appearance-none border-2 font-black py-2.5 px-4 rounded-xl outline-none transition-all text-sm ${(order.subscriptionStatus || order.status) === "Cancelled" ? "cursor-not-allowed" : "cursor-pointer"}
                                                             ${currentStatus === "Cancelled" ? "bg-red-50 border-red-100 text-red-600 focus:border-red-500" :
                                                                     currentStatus === "Completed" ? "bg-green-50 border-green-100 text-green-600 focus:border-green-500" :
                                                                         "bg-orange-50 border-orange-100 text-orange-600 focus:border-orange-500"}
                                                         `}
                                                         >
                                                             <option value="Ongoing">Ongoing</option>
                                                             <option value="Paused">Paused</option>
                                                             <option value="Completed">Completed</option>
                                                             <option value="Cancelled">Cancelled</option>
                                                         </select>
                                                         <MdKeyboardArrowDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none 
                                                         ${currentStatus === "Cancelled" ? "text-red-400" :
                                                                 currentStatus === "Completed" ? "text-green-400" :
                                                                     "text-orange-400"}`}
                                                         />
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className='px-6 py-5 text-center' onClick={(e) => e.stopPropagation()}>
                                                 <button
                                                     onClick={() => statusHandler(order._id, currentStatus)}
                                                     disabled={currentStatus === (order.subscriptionStatus || order.status) || (order.subscriptionStatus || order.status) === "Cancelled"}
                                                     className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 border-2
                                                     ${currentStatus !== (order.subscriptionStatus || order.status) && (order.subscriptionStatus || order.status) !== "Cancelled"
                                                             ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 shadow-orange-200'
                                                             : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'}`}
                                                 >
                                                     Save
                                                 </button>
                                             </td>
                                         </tr>
                                         {isExpanded && (
                                             <tr className='bg-gray-50/50 animate-fadeIn'>
                                                 <td colSpan="13" className='px-12 py-8'>
                                                     <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm'>
                                                         <h4 className='text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2'>
                                                             <MdCalendarToday className='text-orange-500' />
                                                             Delivery Timeline History
                                                         </h4>
                                                         {(!order.deliveryHistory || order.deliveryHistory.length === 0) ? (
                                                             <p className='text-xs text-gray-400 font-medium py-4 text-center'>No deliveries recorded yet.</p>
                                                         ) : (
                                                             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                                                 {order.deliveryHistory.slice().reverse().map((h, i) => (
                                                                     <div key={i} className='p-3 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100'>
                                                                         <div>
                                                                             <p className='text-[11px] font-black text-gray-800'>{new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                                             <p className='text-[10px] font-bold text-orange-600 uppercase'>{h.mealTime}</p>
                                                                         </div>
                                                                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${h.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                             {h.status}
                                                                         </span>
                                                                     </div>
                                                                 ))}
                                                             </div>
                                                         )}
                                                     </div>
                                                 </td>
                                             </tr>
                                         )}
                                     </React.Fragment>
                                 );
                             })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn'>
                    <div className='bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]'>

                        {/* Header */}
                        <div className='px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10'>
                            <div>
                                <h3 className='text-2xl font-black text-gray-800'>Add Monthly Subscription</h3>
                                <p className='text-sm text-gray-500 font-medium mt-1'>Manually process a subscription for a registered user.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setVerifiedUser(null);
                                    setVerifyEmailInput("");
                                }}
                                className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600'
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className='p-8 overflow-y-auto custom-scrollbar flex-1'>

                            {/* Step 1: Verify Email */}
                            <div className='mb-8'>
                                <label className='block text-sm font-bold text-gray-700 mb-2'>1. Verify User Email</label>
                                <div className='flex gap-3'>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={verifyEmailInput}
                                        onChange={(e) => setVerifyEmailInput(e.target.value)}
                                        disabled={verifiedUser !== null}
                                        className='flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-medium transition-all disabled:opacity-50'
                                    />
                                    {verifiedUser ? (
                                        <button
                                            onClick={() => {
                                                setVerifiedUser(null);
                                                setVerifyEmailInput("");
                                            }}
                                            className='px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95'
                                        >
                                            Change
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleVerifyEmail}
                                            className='px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all active:scale-95 shadow-md shadow-gray-200'
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                                {verifiedUser && (
                                    <div className='mt-3 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-fadeIn'>
                                        <div className='w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-sm uppercase shrink-0'>
                                            {verifiedUser.name[0]}
                                        </div>
                                        <div>
                                            <p className='font-bold text-green-800'>{verifiedUser.name}</p>
                                            <p className='text-xs text-green-600 font-medium'>{verifiedUser.phone} • {verifiedUser.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Configure Subscription */}
                            <div className={`transition-all duration-300 ${verifiedUser ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                <label className='block text-sm font-bold text-gray-700 mb-4'>2. Configure Subscription</label>

                                <div className='space-y-6 mb-6'>
                                    {/* Order Plan Tabs */}
                                    <div>
                                        <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdCalendarToday /> Order Plan</p>
                                        <div className='flex flex-wrap gap-3'>
                                            {['15_days', '30_days'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setNewSub({ ...newSub, plan: type })}
                                                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex-1 text-center min-w-[120px] ${newSub.plan === type ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 scale-105' : 'bg-white text-gray-500 border-2 border-transparent hover:border-orange-200'}`}
                                                >
                                                    {type === '15_days' ? '15 Days Sub' : '30 Days Sub'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Meal Timing */}
                                    <div>
                                        <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdCheckCircle /> Meal Timing</p>
                                        <div className='flex flex-wrap gap-3'>
                                            {['Lunch', 'Dinner', 'Both'].map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setNewSub({ ...newSub, mealTiming: time })}
                                                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex-1 text-center min-w-[100px] ${newSub.mealTiming === time ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-105' : 'bg-white text-gray-500 border-2 border-transparent hover:border-green-200'}`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Meal Preference */}
                                    <div>
                                        <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdRestaurantMenu /> Meal Preference</p>
                                        <div className='flex flex-wrap gap-3'>
                                            {['Veg', 'Non-Veg', 'Both'].map(mealType => (
                                                <button
                                                    key={mealType}
                                                    onClick={() => setNewSub({ ...newSub, mealPreference: mealType })}
                                                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex-1 text-center min-w-[100px] ${newSub.mealPreference === mealType ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-gray-500 border-2 border-transparent hover:border-blue-200'}`}
                                                >
                                                    {mealType}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery Location */}
                                    <div>
                                        <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdLocationOn /> Delivery Location</p>
                                        <div className='relative'>
                                            <select
                                                value={newSub.address}
                                                onChange={(e) => setNewSub({ ...newSub, address: e.target.value })}
                                                className='w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-bold text-gray-700 cursor-pointer appearance-none'
                                            >
                                                <option value="Naraj Depot">Naraj Depot</option>
                                                <option value="NLU">NLU</option>
                                                <option value="Sri sri university">Sri sri university</option>
                                                <option value="Ravensa college">Ravensa college</option>
                                            </select>
                                            <MdKeyboardArrowDown className='absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none' />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {/* Phone Number */}
                                        <div>
                                            <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdOutlineContactPhone /> Phone Number</p>
                                            <input
                                                type="tel"
                                                value={newSub.phone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setNewSub({ ...newSub, phone: val });
                                                }}
                                                placeholder="Enter phone number"
                                                className='w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-bold text-gray-700 transition-all placeholder:font-medium'
                                            />
                                        </div>

                                        {/* Discount */}
                                        <div>
                                            <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdRemove /> Discount (%)</p>
                                            <input
                                                type="number"
                                                value={newSub.discount || ""}
                                                onChange={(e) => setNewSub({ ...newSub, discount: e.target.value })}
                                                placeholder="Optional"
                                                min="0"
                                                max="100"
                                                className='w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-500 font-bold text-gray-700 transition-all placeholder:font-medium'
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer / Summary */}
                        <div className={`px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between transition-all duration-300 ${verifiedUser ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                            <div>
                                <p className='text-xs font-bold text-gray-500 tracking-wider uppercase mb-1'>Total Amount</p>
                                {Number(newSub.discount) > 0 && calculatedAmount > 0 ? (
                                    <div className='flex flex-col'>
                                        <p className='text-sm font-bold text-red-500 line-through'>₹{calculatedAmount}</p>
                                        <p className='text-3xl font-black text-gray-900'>
                                            ₹{Math.max(0, calculatedAmount - (calculatedAmount * Number(newSub.discount) / 100)).toFixed(2)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className={`text-3xl font-black ${calculatedAmount > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                                        {calculatedAmount > 0 ? `₹${calculatedAmount}` : 'Invalid Setup'}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleAdminPlaceOrder}
                                disabled={calculatedAmount === 0 || !verifiedUser}
                                className='px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-lg hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Save Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MonthlyOrders
