import React, { useContext, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaStar, FaQuoteLeft, FaTimes } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'swiper/css';
import 'swiper/css/pagination';
import { StoreContext } from '../../context/StoreContext';

const FeedbackSection = () => {
    const { token, url, setShowLogin } = useContext(StoreContext);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [liveReviews, setLiveReviews] = useState([]);

    // Static seed feedbacks shown until real ones load
    const seedFeedbacks = [
        {
            name: "Rahul Sharma",
            rating: 5,
            comment: "Excellent food and fast delivery! The Chicken Biryani was absolutely delicious and well-packaged. Highly recommended!",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
        },
        {
            name: "Priya Singh",
            rating: 4,
            comment: "Great experience. The Veg Thali was fresh and healthy. The portion size was perfect for a wholesome meal.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
        },
        {
            name: "Amit Patel",
            rating: 5,
            comment: "Best food delivery service in town. FlavoHub has become my go-to for late-night cravings. Always on time!",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
        }
    ];

    const fetchReviews = async () => {
        try {
            const res = await axios.get(url + '/api/review/list');
            if (res.data.success && res.data.data.length > 0) {
                setLiveReviews(res.data.data.slice(-10).reverse());
            }
        } catch (_) { /* keep seed data */ }
    };

    useEffect(() => { fetchReviews(); }, []);

    const displayFeedbacks = liveReviews.length > 0
        ? liveReviews.map(r => ({
            name: r.userName,
            rating: r.rating,
            comment: r.comment,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.userName)}`
        }))
        : seedFeedbacks;

    const handleOpenForm = () => {
        if (!token) {
            toast.info('Please login to leave a feedback');
            setShowLogin(true);
            return;
        }
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { toast.error('Please select a rating'); return; }
        if (comment.trim().length < 10) { toast.error('Comment must be at least 10 characters'); return; }

        setSubmitting(true);
        try {
            const res = await axios.post(
                url + '/api/review/add',
                { rating, comment: comment.trim() },
                { headers: { token } }
            );
            if (res.data.success) {
                setSubmitted(true);
                toast.success(res.data.message);
                fetchReviews();
                setTimeout(() => {
                    setShowForm(false);
                    setSubmitted(false);
                    setRating(0);
                    setComment('');
                }, 2000);
            } else {
                toast.error(res.data.message);
            }
        } catch (_) {
            toast.error('Something went wrong. Please try again.');
        }
        setSubmitting(false);
    };

    const starLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

    return (
        <>
            <section className='w-[92%] sm:w-[90%] md:w-[85%] lg:w-[80%] m-auto py-6 md:py-10' id='feedback'>

                {/* ── Header ── */}
                <div className='flex flex-col items-center mb-6 md:mb-12'>
                    <h2 className='text-2xl sm:text-3xl md:text-5xl font-black text-[#323232] text-center mb-4'>
                        What Our <span className='text-[#ff7e00]'>Customers</span> Say
                    </h2>
                    <div className='w-20 md:w-24 h-1.5 bg-[#ff7e00] rounded-full' />
                </div>

                {/* ── Swiper ── */}
                <div className='relative'>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            768: { slidesPerView: 2, spaceBetween: 30 },
                            1024: { slidesPerView: 3, spaceBetween: 40 }
                        }}
                        className="!pt-12 !pb-14"
                    >
                        {displayFeedbacks.map((item, index) => (
                            <SwiperSlide key={index} className="!h-auto flex">
                                <div className='relative bg-white/40 backdrop-blur-md border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(255,126,0,0.1)] transition-all duration-500 group flex flex-col w-full mx-1 my-2'>
                                    <div className='absolute -top-5 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 w-11 h-11 bg-[#ff7e00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300 z-10'>
                                        <FaQuoteLeft size={18} />
                                    </div>
                                    <div className='flex flex-col gap-4 flex-1 mt-2'>
                                        <p className='text-gray-600 italic leading-relaxed text-sm sm:text-base md:text-lg text-center md:text-left'>
                                            "{item.comment}"
                                        </p>
                                        <div className='flex flex-col md:flex-row items-center md:items-start gap-4 mt-auto pt-4 text-center md:text-left'>
                                            <div className='w-12 h-12 rounded-2xl overflow-hidden border-2 border-orange-100 bg-orange-50 shrink-0'>
                                                <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                            </div>
                                            <div className='flex flex-col items-center md:items-start'>
                                                <h4 className='font-black text-[#323232] text-base md:text-lg leading-tight'>{item.name}</h4>
                                                <div className='flex text-orange-400 gap-0.5 mt-1'>
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={12} className={i < item.rating ? 'fill-current' : 'text-gray-200'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ── CTA ── */}
                <div className='mt-8 md:mt-10 flex flex-col items-center'>
                    <p className='text-gray-500 font-medium mb-4 text-sm md:text-base text-center'>
                        Loved our food? We'd love to hear from you!
                    </p>
                    <button
                        onClick={handleOpenForm}
                        className='group flex items-center gap-2 w-full sm:w-auto bg-[#323232] text-white px-8 py-3 md:px-10 md:py-4 rounded-2xl font-black text-base md:text-lg hover:bg-[#ff7e00] transition-all active:scale-95 shadow-xl hover:shadow-orange-200 justify-center'
                    >
                        <MdRateReview size={22} className='group-hover:rotate-12 transition-transform duration-300' />
                        Leave a Feedback
                    </button>
                </div>
            </section>

            {/* ── Feedback Modal ── */}
            {showForm && (
                <div
                    className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
                    onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
                >
                    <div className='relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn max-h-[95vh] flex flex-col'>

                        {/* Modal header */}
                        <div className='bg-gradient-to-r from-[#ff7e00] to-amber-400 px-6 py-5 flex items-center justify-between'>
                            <div>
                                <h3 className='text-xl font-black text-white'>Share Your Experience</h3>
                                <p className='text-orange-100 text-sm mt-0.5'>Your feedback helps us improve 🍕</p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className='w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors'
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {submitted ? (
                            /* Success state */
                            <div className='p-10 flex flex-col items-center gap-3 text-center'>
                                <div className='w-16 h-16 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center text-3xl'>
                                    🎉
                                </div>
                                <h4 className='text-xl font-black text-[#323232]'>Thank You!</h4>
                                <p className='text-gray-500 text-sm'>Your review has been submitted and is pending admin approval. It will appear on the site once approved.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-5'>

                                {/* Star Rating */}
                                <div>
                                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                                        How would you rate us? <span className='text-red-400'>*</span>
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type='button'
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                className='focus:outline-none transition-transform hover:scale-125 active:scale-110 duration-150'
                                            >
                                                <FaStar
                                                    size={32}
                                                    className={`transition-colors duration-150 ${star <= (hoveredRating || rating) ? 'text-orange-400' : 'text-gray-200'}`}
                                                />
                                            </button>
                                        ))}
                                        {(hoveredRating || rating) > 0 && (
                                            <span className='ml-2 text-sm font-bold text-orange-500'>
                                                {starLabels[hoveredRating || rating]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className='block text-sm font-bold text-gray-700 mb-2'>
                                        Tell us more <span className='text-red-400'>*</span>
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder='What did you love? What could be better?'
                                        rows={4}
                                        maxLength={500}
                                        className='w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all'
                                    />
                                    <p className='text-right text-xs text-gray-400 mt-1'>{comment.length}/500</p>
                                </div>

                                {/* Submit */}
                                <button
                                    type='submit'
                                    disabled={submitting}
                                    className='w-full py-3.5 rounded-2xl bg-[#ff7e00] hover:bg-orange-600 active:scale-95 text-white font-black text-base transition-all shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                >
                                    {submitting ? (
                                        <>
                                            <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <MdRateReview size={20} />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>

                                <p className='text-center text-xs text-gray-400'>
                                    Your feedback is public and helps other customers
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackSection;
