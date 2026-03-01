import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { MdCheckCircle, MdTimer, MdLocalShipping, MdRestaurant, MdArrowBack } from 'react-icons/md';

const TrackOrder = () => {
    const { orderId } = useParams();
    const { url, token } = useContext(StoreContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.post(url + "/api/order/detail", { orderId }, { headers: { token } });
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrderDetails();
            const interval = setInterval(fetchOrderDetails, 10000); // Polling for updates
            return () => clearInterval(interval);
        }
    }, [token, orderId]);

    if (loading) return <div className='min-h-[60vh] flex items-center justify-center'><div className='animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500'></div></div>;
    if (!order) return <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4'>
        <p className='text-gray-500'>Order not found.</p>
        <button onClick={() => navigate('/myorders')} className='text-orange-500 font-bold'>Back to My Orders</button>
    </div>;

    const statuses = [
        { name: "Food Processing", icon: <MdRestaurant size={24} />, key: "Food Processing" },
        { name: "Preparing", icon: <MdTimer size={24} />, key: "Preparing" },
        { name: "Out for delivery", icon: <MdLocalShipping size={24} />, key: "Out for delivery" },
        { name: "Delivered", icon: <MdCheckCircle size={24} />, key: "Delivered" }
    ];

    const currentStatusIndex = statuses.findIndex(s => s.key === order.status);

    return (
        <div className='max-w-[1000px] mx-auto px-4 pt-28 pb-12 animate-fadeIn'>
            <button
                onClick={() => navigate('/myorders')}
                className='flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8 font-bold'
            >
                <MdArrowBack /> Back to My Orders
            </button>

            <div className='bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden'>
                {/* Header Section */}
                <div className='bg-gradient-to-r from-orange-600 to-orange-400 p-8 text-white'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <p className='text-orange-100 text-sm font-bold uppercase tracking-widest mb-1'>Order ID</p>
                            <h2 className='text-2xl font-black'>#{order._id.slice(-8).toUpperCase()}</h2>
                        </div>
                        <div className='bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl'>
                            <p className='text-xs font-bold text-orange-5  0 uppercase tracking-wider mb-1'>Expected Total</p>
                            <p className='text-2xl font-black'>₹{order.amount}.00</p>
                        </div>
                    </div>
                </div>

                <div className='p-8 md:p-12'>
                    {/* Status Stepper */}
                    <div className='relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16'>
                        <div className='absolute top-[22px] left-8 right-8 hidden md:block h-1 bg-gray-100 rounded-full overflow-hidden'>
                            <div
                                className='h-full bg-orange-500 transition-all duration-1000'
                                style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        {statuses.map((step, index) => (
                            <div key={index} className='flex md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-auto'>
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                                    ${index <= currentStatusIndex ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-50 text-gray-300 border border-gray-100'}
                                `}>
                                    {step.icon}
                                </div>
                                <div className='flex flex-col md:items-center'>
                                    <p className={`text-sm font-bold transition-colors ${index <= currentStatusIndex ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {step.name}
                                    </p>
                                    {index === currentStatusIndex && (
                                        <span className='md:hidden block text-[10px] text-orange-500 font-black uppercase tracking-tighter'>Current Status</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Information Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                        {/* Items Section */}
                        <div className='space-y-6'>
                            <h3 className='text-xl font-black text-gray-800 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full'></span>
                                Order Summary
                            </h3>
                            <div className='bg-gray-50 rounded-3xl border border-gray-100 divide-y divide-gray-100'>
                                {order.items.map((item, index) => (
                                    <div key={index} className='p-4 flex items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center font-bold text-gray-700'>
                                                {item.quantity}x
                                            </div>
                                            <div>
                                                <p className='font-bold text-gray-800'>{item.name}</p>
                                                <p className='text-xs text-gray-500'>₹{item.price} each</p>
                                            </div>
                                        </div>
                                        <p className='font-bold text-gray-700'>₹{item.price * item.quantity}.00</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div className='space-y-6'>
                            <h3 className='text-xl font-black text-gray-800 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full'></span>
                                Delivery Details
                            </h3>

                            <div className='grid gap-6'>
                                <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm'>
                                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>Delivery Address</p>
                                    <div className='space-y-1'>
                                        <p className='font-bold text-gray-800'>{order.address.firstName} {order.address.lastName}</p>
                                        <p className='text-sm text-gray-600 font-bold'>📍 {order.address.address}</p>
                                        <p className='text-xs text-gray-400 font-medium mt-1 italic'>Standard Delivery Point</p>
                                        <p className='text-sm text-orange-500 font-bold mt-2'>{order.address.phone}</p>
                                    </div>
                                </div>

                                {order.status === "Out for delivery" && (
                                    <div className='bg-orange-50 p-6 rounded-3xl border-2 border-orange-200 border-dashed animate-pulse'>
                                        <div className='flex items-center justify-between mb-4'>
                                            <p className='text-xs font-black text-orange-600 uppercase tracking-widest'>Secure Delivery OTP</p>
                                            <MdLocalShipping className='text-orange-500' size={20} />
                                        </div>
                                        <div className='flex items-center justify-center gap-4'>
                                            {order.otp.toString().split('').map((num, i) => (
                                                <div key={i} className='w-12 h-14 bg-white rounded-2xl border border-orange-200 shadow-lg flex items-center justify-center text-2xl font-black text-orange-500'>
                                                    {num}
                                                </div>
                                            ))}
                                        </div>
                                        <p className='text-[10px] text-orange-400 text-center mt-4 font-bold'>Provide this to your rider upon arrival</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
