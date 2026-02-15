import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='relative overflow-hidden bg-white pt-8 md:pt-4'>
            {/* Background Gradient / Decorative Elements */}
            <div className='absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 -skew-x-12 transform translate-x-20 hidden lg:block pointer-events-none'></div>

            {/* Mobile background blob */}
            <div className='absolute top-20 right-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl -z-10 lg:hidden pointer-events-none'></div>

            <div className='w-[90%] md:w-[85%] lg:w-[80%] m-auto py-8 md:py-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16'>
                {/* Text Content */}
                <div className='lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:gap-8 animate-fadeInLeft z-10'>
                    {/* Offer Badge */}
                    <div className='bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[11px] md:text-sm font-bold tracking-wide uppercase flex items-center gap-2 border border-orange-200 shadow-sm'>
                        <span className='flex h-2 w-2 rounded-full bg-orange-500 animate-ping'></span>
                        Limited Offer: 20% OFF
                    </div>

                    <h2 className='font-extrabold text-[#323232] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.1] tracking-tight'>
                        Fresh <span className='text-green-600 underline decoration-green-200 underline-offset-8'>Veg</span> & <span className='text-red-500 underline decoration-red-200 underline-offset-8'>Meats</span> <br className='hidden sm:block' />
                        <span className='block mt-2'>At Your Door</span>
                    </h2>

                    <p className='text-gray-500 text-base md:text-xl leading-relaxed max-w-lg font-medium'>
                        Experience the ultimate food journey with LiteKitchen. From farm-fresh greens to succulent meats, we bring the best of both worlds right to your home.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto px-4 sm:px-0'>
                        <a href='#explore-menu' className='bg-orange-500 text-white font-bold py-3.5 px-8 md:py-4 md:px-10 rounded-full text-lg hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-orange-300 active:scale-95 text-center transform hover:-translate-y-1'>
                            Order Now
                        </a>
                        <a href='#explore-menu' className='bg-white text-[#323232] font-bold py-3.5 px-8 md:py-4 md:px-10 rounded-full text-lg border-2 border-gray-100 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 active:scale-95 text-center shadow-sm hover:shadow-md'>
                            Explore Menu
                        </a>
                    </div>

                    {/* Stats or Trust Markers */}
                    <div className='flex items-center justify-center lg:justify-start gap-6 md:gap-10 mt-4 pt-6 md:pt-8 border-t border-gray-100 w-full lg:w-3/4'>
                        <div className='text-center lg:text-left'>
                            <p className='text-xl md:text-3xl font-black text-[#323232]'>50k+</p>
                            <p className='text-[12px] md:text-sm text-gray-400 font-bold uppercase tracking-wider'>Happy Customers</p>
                        </div>
                        <div className='w-[1px] h-8 md:h-12 bg-gray-200'></div>
                        <div className='text-center lg:text-left'>
                            <p className='text-xl md:text-3xl font-black text-[#323232]'>4.8★</p>
                            <p className='text-[12px] md:text-sm text-gray-400 font-bold uppercase tracking-wider'>Overall Rating</p>
                        </div>
                        <div className='w-[1px] h-8 md:h-12 bg-gray-200 hidden sm:block'></div>
                        <div className='text-center lg:text-left hidden sm:block'>
                            <p className='text-xl md:text-3xl font-black text-[#323232]'>Fast</p>
                            <p className='text-[12px] md:text-sm text-gray-400 font-bold uppercase tracking-wider'>Delivery</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image Section */}
                <div className='w-full max-w-[500px] lg:max-w-none lg:w-[45%] relative animate-fadeInRight'>
                    {/* Decorative Blobs */}
                    <div className='absolute -top-10 -right-10 w-40 h-40 md:w-64 md:h-64 bg-yellow-400/20 rounded-full blur-3xl -z-10 animate-pulse'></div>
                    <div className='absolute -bottom-10 -left-10 w-40 h-40 md:w-64 md:h-64 bg-orange-400/20 rounded-full blur-3xl -z-10 animate-pulse delay-700'></div>

                    <div className='relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] md:border-[12px] border-white transform hover:rotate-1 transition-transform duration-700 ease-in-out'>
                        <img
                            src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Delicious Food Spread"
                            className='w-full h-auto object-cover scale-105 hover:scale-110 transition-transform duration-1000'
                        />


                        {/* Floating elements inside image section */}
                        <div className='absolute top-4 left-4 md:top-6 md:left-6 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2 md:gap-3 animate-bounce z-20'>
                            <div className='w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center text-lg md:text-xl'>🥗</div>
                            <div>
                                <p className='text-[10px] md:text-xs font-bold text-gray-800 leading-tight'>Super Fresh</p>
                                <p className='text-[9px] md:text-[10px] text-gray-500 font-medium'>100% Organic</p>
                            </div>
                        </div>

                        <div className='absolute bottom-6 right-4 md:bottom-8 md:right-6 bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-2 md:gap-3 animate-bounce-slow z-20'>
                            <div className='w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg md:text-xl'>🚚</div>
                            <div>
                                <p className='text-[10px] md:text-xs font-bold text-gray-800 leading-tight'>Fast Delivery</p>
                                <p className='text-[9px] md:text-[10px] text-gray-500 font-medium'>30 min Guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className='absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180'>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 md:h-12 fill-gray-50/50">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </div>
    )
}

export default Header

