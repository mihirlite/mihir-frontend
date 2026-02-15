import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import ReviewModal from '../../components/ReviewModal/ReviewModal';
import { useNavigate } from 'react-router-dom';
import { MdLocalShipping, MdReceipt, MdTimer, MdCheckCircle, MdCancel, MdFeedback, MdTrackChanges } from 'react-icons/md';

const MyOrders = () => {

    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            setData(response.data.data.reverse()); // Show newest first
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-600 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-600 border-red-200";
            case "Out for delivery": return "bg-blue-100 text-blue-600 border-blue-200";
            case "Food Processing": return "bg-orange-100 text-orange-600 border-orange-200";
            case "Preparing": return "bg-yellow-100 text-yellow-600 border-yellow-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered": return <MdCheckCircle className='text-lg' />;
            case "Cancelled": return <MdCancel className='text-lg' />;
            case "Out for delivery": return <MdLocalShipping className='text-lg' />;
            case "Food Processing": return <MdTimer className='text-lg' />;
            default: return <MdTimer className='text-lg' />;
        }
    }

    return (
        <div className='max-w-[1200px] mx-auto px-4 pt-28 pb-12 animate-fadeIn'>
            <div className='flex items-center justify-between mb-10'>
                <div>
                    <h2 className='text-3xl font-black text-gray-800 mb-2'>My Orders</h2>
                    <p className='text-gray-500 font-medium'>Manage and track your recent orders</p>
                </div>
                <div className='hidden sm:flex bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100'>
                    <p className='text-orange-600 font-bold text-sm'>{data.length} Total Orders</p>
                </div>
            </div>

            <div className="space-y-6">
                {data.length === 0 ? (
                    <div className='text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200'>
                        <MdReceipt className='mx-auto text-6xl text-gray-200 mb-4' />
                        <h3 className='text-xl font-bold text-gray-400'>No orders found yet</h3>
                        <button onClick={() => navigate('/#menu')} className='mt-6 px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all'>
                            Order Something Delicious
                        </button>
                    </div>
                ) : (
                    data.map((order, index) => (
                        <div
                            key={index}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className='group bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 animate-fadeIn'
                        >
                            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8'>
                                {/* Order Header - Mobile Friendly */}
                                <div className='flex items-start gap-4 flex-1'>
                                    <div className='w-14 h-14 md:w-16 md:h-16 bg-orange-50 rounded-[20px] flex items-center justify-center text-orange-500 shrink-0'>
                                        <MdReceipt size={28} />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex flex-wrap items-center gap-2 mb-2'>
                                            <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider'>
                                                ID: {order._id.slice(-8).toUpperCase()}
                                            </span>
                                            <div className={`px-3 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${getStatusStyles(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </div>
                                        <p className='text-gray-700 font-medium text-sm leading-relaxed mb-1'>
                                            {order.items.map((item, id) => (
                                                <span key={id}>
                                                    {item.name} <span className='text-orange-500 font-bold'>x{item.quantity}</span>
                                                    {id !== order.items.length - 1 ? ", " : ""}
                                                </span>
                                            ))}
                                        </p>
                                        <p className='text-xs text-gray-400 font-medium flex items-center gap-1 mt-2'>
                                            {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Info - Responsive Grid/Flex */}
                                <div className='flex flex-wrap items-center gap-6 md:gap-10 border-t lg:border-t-0 border-gray-50 pt-6 lg:pt-0'>
                                    <div className='flex-1 lg:flex-none text-center lg:text-left'>
                                        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1'>Total Amount</p>
                                        <p className='text-2xl font-black text-gray-800'>${order.amount}.00</p>
                                    </div>

                                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                                        <div className='flex-1 lg:flex-none'>
                                            <div className='bg-orange-600 text-white p-2.5 px-5 rounded-2xl shadow-lg shadow-orange-200 text-center animate-pulse'>
                                                <p className='text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5'>Delivery OTP</p>
                                                <p className='text-xl font-black tracking-widest'>{order.otp}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className='w-full lg:w-auto flex flex-col sm:flex-row gap-3 mt-2 lg:mt-0'>
                                        <button
                                            onClick={() => navigate(`/track-order/${order._id}`)}
                                            className='flex-1 px-6 py-3.5 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-orange-100'
                                        >
                                            <MdTrackChanges size={18} />
                                            Track Order
                                        </button>
                                        <button
                                            onClick={() => { setSelectedOrderId(order._id); setShowReviewModal(true); }}
                                            className='flex-1 px-6 py-3.5 bg-white text-gray-600 border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-200 transition-all'
                                        >
                                            <MdFeedback size={18} />
                                            Feedback
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {showReviewModal && <ReviewModal orderId={selectedOrderId} setShowReviewModal={setShowReviewModal} />}
        </div>
    )
}

export default MyOrders
