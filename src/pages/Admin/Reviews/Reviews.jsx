import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdCheckCircleOutline, MdHighlightOff, MdRefresh, MdDeleteOutline } from "react-icons/md";
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Reviews = ({ url, token }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/review/admin-list`, { headers: { token } });
            if (response.data.success) {
                setReviews(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching reviews", error);
            toast.error("Error loading reviews");
        }
        setLoading(false);
    }

    const updateStatus = async (id, status) => {
        try {
            const response = await axios.post(`${url}/api/review/update-status`, { id, status }, { headers: { token } });
            if (response.data.success) {
                toast.success(`Review ${status}`);
                fetchAllReviews();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating review status", error);
            toast.error("Error updating status");
        }
    }

    const deleteReview = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this review?")) {
            try {
                const response = await axios.post(`${url}/api/review/remove`, { id }, { headers: { token } });
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchAllReviews();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error deleting review", error);
                toast.error("Error deleting review");
            }
        }
    }

    useEffect(() => {
        if (token) {
            fetchAllReviews();
        }
    }, [token]);

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-2xl font-black text-gray-800 mb-1'>Feedback Control</h3>
                    <p className='text-sm text-gray-500'>Moderate and manage customer feedbacks</p>
                </div>
                <button
                    onClick={fetchAllReviews}
                    className='w-fit px-6 py-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl font-bold transition-all border border-gray-100 flex items-center gap-2'
                >
                    <MdRefresh size={20} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center py-20'>
                    <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className='text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200'>
                    <p className='text-gray-400 font-medium'>No reviews found to moderate.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review, index) => (
                        <div key={index} className='relative bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group flex flex-col'>
                            {/* Actions Top */}
                            <div className='absolute top-6 right-6 flex items-center gap-2'>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${review.status === 'approved' ? 'bg-green-100 text-green-600' :
                                    review.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                    {review.status}
                                </span>
                                <button
                                    onClick={() => deleteReview(review._id)}
                                    className='p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all'
                                    title="Delete Review"
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </div>

                            <div className='flex items-start gap-4 mb-4'>
                                <div className='w-12 h-12 rounded-2xl overflow-hidden border-2 border-orange-100 bg-orange-50 shrink-0'>
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.userName)}`} alt={review.userName} className='w-full h-full object-cover' />
                                </div>
                                <div className='pt-1'>
                                    <h4 className='font-black text-gray-800 text-lg leading-tight'>{review.userName}</h4>
                                    <div className='flex text-orange-400 gap-0.5 mt-1'>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <p className='text-[10px] text-gray-400 font-bold uppercase mt-1'>Order ID: {review.orderId}</p>
                                </div>
                            </div>

                            <div className='flex-1 relative mb-6'>
                                <FaQuoteLeft className='text-orange-500/10 absolute -top-2 -left-2 text-4xl' />
                                <p className='text-gray-600 italic text-sm md:text-base pl-6'>
                                    "{review.comment}"
                                </p>
                            </div>

                            <div className='flex items-center gap-3 mt-auto pt-4 border-t border-gray-50'>
                                {review.status !== 'approved' && (
                                    <button
                                        onClick={() => updateStatus(review._id, 'approved')}
                                        className='flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95'
                                    >
                                        <MdCheckCircleOutline size={18} />
                                        Approve
                                    </button>
                                )}
                                {review.status !== 'rejected' && (
                                    <button
                                        onClick={() => updateStatus(review._id, 'rejected')}
                                        className='flex-1 bg-white border border-red-100 text-red-500 hover:bg-red-50 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95'
                                    >
                                        <MdHighlightOff size={18} />
                                        Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Reviews
