import React, { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { FiX, FiStar } from 'react-icons/fi';
import './ReviewModal.css';

const ReviewModal = ({ orderId, setShowReviewModal }) => {
    const { url, token } = useContext(StoreContext);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please leave a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(url + "/api/review/add", {
                orderId,
                rating,
                comment
            }, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                setShowReviewModal(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn' onClick={() => setShowReviewModal(false)}>
            <div className='bg-white w-full max-w-[500px] rounded-[2rem] shadow-2xl overflow-hidden animate-scaleIn' onClick={(e) => e.stopPropagation()}>
                <div className='p-6 md:p-8'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl md:text-3xl font-black text-gray-800 tracking-tight'>Rate Your Order</h2>
                        <div onClick={() => setShowReviewModal(false)} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-orange-100 hover:text-orange-500 transition-all group'>
                            <FiX className='text-xl text-gray-500 group-hover:rotate-90 transition-transform duration-300' />
                        </div>
                    </div>

                    <div className='text-center mb-8'>
                        <p className='text-gray-500 font-medium mb-4'>How was your experience?</p>
                        <div className='flex justify-center gap-3'>
                            {[...Array(5)].map((star, index) => {
                                index += 1;
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`transition-all duration-200 hover:scale-110 active:scale-95 outline-none ${index <= (hover || rating) ? "text-orange-500" : "text-gray-200"}`}
                                        onClick={() => setRating(index)}
                                        onMouseEnter={() => setHover(index)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        <FiStar className={`w-10 h-10 md:w-12 md:h-12 ${index <= (hover || rating) ? "fill-orange-500" : "fill-current"}`} />
                                    </button>
                                );
                            })}
                        </div>
                        <p className='h-6 mt-2 text-sm font-bold text-orange-500 transition-all'>
                            {hover === 1 && "Terrible"}
                            {hover === 2 && "Bad"}
                            {hover === 3 && "Okay"}
                            {hover === 4 && "Good"}
                            {hover === 5 && "Excellent!"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <div className="relative group">
                            <textarea
                                className='w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all resize-none text-gray-700 min-h-[120px]'
                                placeholder='Tell us what you liked (or didn&apos;t)...'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium pointer-events-none">
                                {comment.length} chars
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-200 active:scale-95 hover:shadow-2xl transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
