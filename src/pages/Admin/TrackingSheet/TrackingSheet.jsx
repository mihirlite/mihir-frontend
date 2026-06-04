import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdOutlineLocalShipping, MdRefresh, MdCalendarMonth } from "react-icons/md";

const TrackingSheet = ({ url, token }) => {
    const [orders, setOrders] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const fetchMonthlyOrders = async () => {
        try {
            const response = await axios.get(url + "/api/order/list", { headers: { token } });
            if (response.data.success) {
                const monthlyOrdersFiltered = (response.data.data || []).filter(order => {
                    return (order.items || []).some(item => item && item.subscription && item.subscription.orderType !== 'today');
                });
                setOrders(monthlyOrdersFiltered.reverse());
            } else {
                toast.error("Error fetching operations data");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network Error");
        }
    };

    useEffect(() => {
        fetchMonthlyOrders();
    }, [url, token]);

    // Helpers to generate date headers
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const dateColumns = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const checkDeliveryOnDate = (order, day) => {
        if (!order.deliveryHistory) return false;
        const targetDateStr = new Date(currentYear, currentMonth, day).toLocaleDateString('en-GB');
        return order.deliveryHistory.some(history => {
            const historyDateStr = new Date(history.date).toLocaleDateString('en-GB');
            return historyDateStr === targetDateStr;
        });
    };

    const toggleDelivery = async (orderId, day) => {
        try {
            const dateToUpdate = new Date(currentYear, currentMonth, day);
            
            // Optional optimistic UI could be added here, but for simplicity we rely on refetch
            const response = await axios.post(`${url}/api/order/toggle-daily-delivery`, { 
                orderId, 
                date: dateToUpdate.toISOString() 
            }, { headers: { token } });
            
            if (response.data.success) {
                fetchMonthlyOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error toggling delivery status");
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1 flex items-center gap-3'>
                        <MdCalendarMonth className="text-orange-500" /> Daily Tracking Sheet
                    </h3>
                    <p className='text-sm text-gray-500 font-medium'>Detailed attendance register for subscriptions</p>
                </div>
                
                <div className='flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm'>
                    <button onClick={prevMonth} className='px-4 py-2 hover:bg-gray-50 rounded-xl font-bold text-gray-500'>&lt; Prev</button>
                    <p className='font-black text-orange-600 min-w-[100px] text-center'>
                        {monthNames[currentMonth]} {currentYear}
                    </p>
                    <button onClick={nextMonth} className='px-4 py-2 hover:bg-gray-50 rounded-xl font-bold text-gray-500'>Next &gt;</button>
                    
                    <button onClick={fetchMonthlyOrders} className='ml-2 p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all'>
                        <MdRefresh size={20} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-sm bg-white">
                <table className='w-full text-left border-collapse min-w-max'>
                    <thead>
                        <tr className='bg-gray-50/50 border-b border-gray-100'>
                            <th className='px-4 py-5 text-xs font-black text-gray-700 uppercase tracking-wider sticky left-0 z-10 bg-gray-50 shadow-[1px_0_0_#f3f4f6]'>Name</th>
                            <th className='px-4 py-5 text-xs font-black text-gray-700 uppercase tracking-wider'>Plan</th>
                            <th className='px-4 py-5 text-xs font-black text-gray-700 uppercase tracking-wider'>Start</th>
                            <th className='px-4 py-5 text-xs font-black text-gray-700 uppercase tracking-wider'>End</th>
                            <th className='px-4 py-5 text-xs font-black text-gray-700 uppercase tracking-wider text-center'>Paid</th>
                            <th className='px-4 py-5 text-xs font-black text-gray-700 uppercase tracking-wider border-r border-gray-100'>Today Delivery</th>
                            {dateColumns.map(day => (
                                <th key={day} className='px-2 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wider text-center min-w-[32px]'>
                                    {day} <br />
                                    <span className='font-medium text-gray-400'>
                                        {monthNames[currentMonth]}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6 + dateColumns.length} className='px-6 py-12 text-center text-gray-400 font-medium'>
                                    No subscription orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => {
                                let isMonthly = false;
                                let planDays = 15;
                                let vegCount = 0;
                                let nonVegCount = 0;
                                let deliveryName = [];

                                order.items.forEach(item => {
                                    if (item.subscription && item.subscription.orderType !== 'today') {
                                        if (item.subscription.orderType === '30 Days' || item.subscription.orderType === '30_days') {
                                            isMonthly = true;
                                            planDays = 30;
                                        }
                                        if (item.subscription.mealType === 'Veg') vegCount++;
                                        if (item.subscription.mealType === 'Non-Veg') nonVegCount++;
                                        if (item.name) deliveryName.push(item.name.replace(" Thali", ""));
                                    }
                                });

                                const startDate = new Date(order.date);
                                const endDate = new Date(order.date);
                                endDate.setDate(startDate.getDate() + (isMonthly ? 30 : 15));

                                const prefName = vegCount > 0 && nonVegCount > 0 ? 'Both' : vegCount > 0 ? 'Veg' : nonVegCount > 0 ? 'Non-Veg' : 'Mixed';
                                const mealDetails = [...new Set(deliveryName)].join(" & ");

                                return (
                                    <tr key={index} className='hover:bg-orange-50/20 transition-colors'>
                                        <td className='px-4 py-3 sticky left-0 z-10 bg-white shadow-[1px_0_0_#f3f4f6] group-hover:bg-orange-50/20 font-bold text-gray-800 whitespace-nowrap text-sm'>
                                            {order.address?.firstName || 'Unknown'}
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600 font-medium whitespace-nowrap'>
                                            {isMonthly ? '30 Days' : '15 Days'}
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600 whitespace-nowrap'>
                                            {startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-600 whitespace-nowrap'>
                                            {endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className='px-4 py-3 text-center'>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${order.payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {order.payment ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3 border-r border-gray-100 whitespace-nowrap'>
                                            <span className={`px-2 py-1 rounded text-[11px] font-black ${prefName.includes('Veg') && !prefName.includes('Non') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {mealDetails || prefName}
                                            </span>
                                        </td>
                                        {dateColumns.map(day => {
                                            const isDelivered = checkDeliveryOnDate(order, day);
                                            
                                            const cellDate = new Date(currentYear, currentMonth, day);
                                            const isFuture = cellDate > new Date(new Date().setHours(23,59,59,999));
                                            
                                            // Safe date copies for boundaries
                                            const tempStart = new Date(startDate);
                                            tempStart.setHours(0,0,0,0);
                                            
                                            const tempEnd = new Date(endDate);
                                            tempEnd.setHours(23,59,59,999);
                                            
                                            const isBeforeStart = cellDate < tempStart;
                                            const isAfterEnd = cellDate > tempEnd;
                                            
                                            if (isBeforeStart || isAfterEnd) {
                                                return <td key={day} className='px-2 py-3 text-center'><span className='text-gray-200 text-sm'>-</span></td>;
                                            }

                                            return (
                                                <td 
                                                    key={day} 
                                                    onClick={() => !isFuture && toggleDelivery(order._id, day)} 
                                                    className={`px-2 py-3 text-center transition-all select-none ${!isFuture ? 'cursor-pointer hover:bg-white rounded active:scale-90 hover:shadow-sm' : ''}`}
                                                    title={!isFuture ? 'Click to toggle delivery status' : ''}
                                                >
                                                    {isDelivered ? (
                                                        <span className='text-green-500 font-black text-sm drop-shadow-sm'>✔</span>
                                                    ) : isFuture ? (
                                                        <span className='text-gray-200 text-sm'>-</span>
                                                    ) : (
                                                        <span className='text-red-400 font-black text-xs opacity-75'>❌</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackingSheet;
