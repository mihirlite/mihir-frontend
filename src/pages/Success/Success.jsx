import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdShoppingBag, MdHome } from 'react-icons/md';
import successImg from '../../assets/order_success.png';

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
        
        // Dynamic Title
        document.title = "Order Successful! | Flavohub";
    }, []);

    return (
        <div className='min-h-[100dvh] bg-gray-50/30 flex items-center justify-center pt-24 md:pt-32 pb-12 md:pb-20 px-4'>
            <div className='max-w-2xl w-full'>
                <div className='bg-white rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden text-center animate-fadeIn'>
                    {/* Background Decorative Elements */}
                    <div className='absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-green-100/30 rounded-full blur-[80px] md:blur-[100px] -mr-24 md:-mr-32 -mt-24 md:-mt-32'></div>
                    <div className='absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-orange-100/20 rounded-full blur-[60px] md:blur-[80px] -ml-16 md:-ml-24 -mb-16 md:-mb-24'></div>

                    {/* Success Image/Illustration */}
                    <div className='relative z-10 mb-6 md:mb-8 transform hover:scale-105 transition-transform duration-500'>
                        <img 
                            src={successImg} 
                            alt="Order Successful" 
                            className='w-48 sm:w-56 md:w-80 mx-auto drop-shadow-2xl'
                        />
                        <div className='absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-lg shadow-green-200 animate-bounce'>
                            <MdCheckCircle size={24} className='md:w-8 md:h-8' />
                        </div>
                    </div>

                    {/* Content */}
                    <div className='relative z-10'>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-3 md:mb-4 tracking-tight'>
                            Order Successful!
                        </h1>
                        <p className='text-gray-500 font-medium text-sm md:text-lg mb-8 md:mb-10 max-w-md mx-auto leading-relaxed px-2 md:px-0'>
                            Your delicious meal is being prepared with love. We've received your payment and will start the delivery process shortly.
                        </p>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4'>
                            <button 
                                onClick={() => navigate('/myorders')}
                                className='w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-orange-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center justify-center gap-2'
                            >
                                <MdShoppingBag size={18} className='md:w-5 md:h-5' />
                                View My Orders
                            </button>
                            <button 
                                onClick={() => navigate('/')}
                                className='w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white text-gray-600 border-2 border-gray-100 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2'
                            >
                                <MdHome size={18} className='md:w-5 md:h-5' />
                                Back to Home
                            </button>
                        </div>

                        {/* Order Timeline Preview (Simple) */}
                        <div className='mt-10 md:mt-16 pt-6 md:pt-8 border-t border-gray-50'>
                            <p className='text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 md:mb-6'>What happens next?</p>
                            <div className='flex items-center justify-between max-w-[280px] md:max-w-sm mx-auto'>
                                <div className='flex flex-col items-center gap-1.5 md:gap-2'>
                                    <div className='w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] md:text-xs'>1</div>
                                    <span className='text-[8px] md:text-[9px] font-black text-gray-600 uppercase'>Confirmed</span>
                                </div>
                                <div className='flex-1 h-[2px] bg-green-500 mx-1.5 md:mx-2'></div>
                                <div className='flex flex-col items-center gap-1.5 md:gap-2'>
                                    <div className='w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] md:text-xs'>2</div>
                                    <span className='text-[8px] md:text-[9px] font-black text-gray-400 uppercase'>Cooking</span>
                                </div>
                                <div className='flex-1 h-[2px] bg-gray-100 mx-1.5 md:mx-2'></div>
                                <div className='flex flex-col items-center gap-1.5 md:gap-2'>
                                    <div className='w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] md:text-xs'>3</div>
                                    <span className='text-[8px] md:text-[9px] font-black text-gray-400 uppercase'>Delivered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6 md:mt-8 text-center px-4'>
                    <p className='text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest flex flex-wrap items-center justify-center gap-1.5 md:gap-2 leading-relaxed'>
                        Thank you for choosing Flavohub
                        <span className='hidden sm:block w-1.5 h-1.5 bg-orange-500 rounded-full'></span>
                        <span className='block sm:inline'>Enjoy your meal!</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Success;

