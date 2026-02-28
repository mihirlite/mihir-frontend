import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const FeedbackSection = () => {
    const feedbacks = [
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

    return (
        <section className='w-[92%] sm:w-[90%] md:w-[85%] lg:w-[80%] m-auto py-8 md:py-16' id='feedback'>
            <div className='flex flex-col items-center mb-6 md:mb-12'>
                <h2 className='text-2xl sm:text-3xl md:text-5xl font-black text-[#323232] text-center mb-4'>
                    What Our <span className='text-[#ff7e00]'>Customers</span> Say
                </h2>
                <div className='w-20 md:w-24 h-1.5 bg-[#ff7e00] rounded-full'></div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                {feedbacks.map((item, index) => (
                    <div
                        key={index}
                        className='relative bg-white/40 backdrop-blur-md border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(255,126,0,0.1)] transition-all duration-500 group hover:-translate-y-3 flex flex-col'
                    >
                        {/* Quote Icon Icon */}
                        <div className='absolute -top-6 left-10 w-12 h-12 bg-[#ff7e00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300'>
                            <FaQuoteLeft size={20} />
                        </div>

                        <div className='flex flex-col gap-4'>
                            <p className='text-gray-600 italic leading-relaxed text-sm sm:text-base md:text-lg'>
                                "{item.comment}"
                            </p>

                            <div className='flex items-center gap-4 mt-4'>
                                <div className='w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-100 bg-orange-50'>
                                    <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                </div>
                                <div>
                                    <h4 className='font-black text-[#323232] text-lg'>{item.name}</h4>
                                    <div className='flex text-orange-400 gap-0.5 mt-1'>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={14} className={i < item.rating ? "fill-current" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA for more feedback */}
            <div className='mt-8 md:mt-10 flex flex-col items-center animate-fadeIn'>
                <p className='text-gray-500 font-medium mb-4 text-sm md:text-base text-center'>Loved our food? We'd love to hear from you!</p>
                <button className='w-full sm:w-auto bg-[#323232] text-white px-8 py-3 md:px-10 md:py-4 rounded-2xl font-black text-base md:text-lg hover:bg-[#ff7e00] transition-all transform active:scale-95 shadow-xl hover:shadow-orange-200'>
                    Leave a Feedback
                </button>
            </div>
        </section>
    );
};

export default FeedbackSection;
