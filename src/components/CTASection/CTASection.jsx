import React from 'react'
import { MdPhoneIphone, MdGetApp } from 'react-icons/md';

const CTASection = () => {
    return (
        <div className='my-24 md:my-36 bg-[#1a1a1a] rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-orange-950/20' id='app-download'>

            {/* Animated Background Accents */}
            <div className='absolute -top-24 -right-24 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] animate-pulse'></div>
            <div className='absolute -bottom-24 -left-24 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] animate-pulse' style={{ animationDelay: '2s' }}></div>

            <div className='relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8'>

                {/* Content Side */}
                <div className='lg:w-3/5 text-center lg:text-left space-y-8 animate-fadeInLeft'>
                    <div className='inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-500 text-xs font-black uppercase tracking-widest mb-4'>
                        <MdPhoneIphone size={18} /> Experience Litefood on the go
                    </div>

                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter'>
                        For a Better Experience <br />
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600'>
                            Download Mobile App
                        </span>
                    </h2>

                    <p className='text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed'>
                        Get exclusive offers, real-time order tracking, and a seamless ordering experience right at your fingertips. Join our food community today!
                    </p>

                    <div className='flex flex-wrap justify-center lg:justify-start gap-5 pt-4'>
                        <a href="#" className='group transition-transform active:scale-95'>
                            <img
                                src="https://raw.githubusercontent.com/avinashdm/food-del/main/frontend/src/assets/play_store.png"
                                alt="Play Store"
                                className='h-14 md:h-16 object-contain hover:brightness-110 drop-shadow-lg transition-all group-hover:-translate-y-1'
                            />
                        </a>
                        <a href="#" className='group transition-transform active:scale-95'>
                            <img
                                src="https://raw.githubusercontent.com/avinashdm/food-del/main/frontend/src/assets/app_store.png"
                                alt="App Store"
                                className='h-14 md:h-16 object-contain hover:brightness-110 drop-shadow-lg transition-all group-hover:-translate-y-1'
                            />
                        </a>
                    </div>

                    <div className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 pt-6'>
                        <div className='flex -space-x-3'>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className='w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-gray-800 flex items-center justify-center text-[10px] font-black'>
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className='text-sm font-bold'>+12k active users using the app</p>
                    </div>
                </div>

                {/* Visual Side */}
                <div className='lg:w-2/5 flex justify-center lg:justify-end animate-fadeInRight' style={{ animationDelay: '400ms' }}>
                    <div className='relative group'>
                        {/* Decorative Glow */}
                        <div className='absolute inset-0 bg-orange-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>

                        <img
                            src="https://raw.githubusercontent.com/avinashdm/food-del/main/frontend/src/assets/app_info.png"
                            alt="App Preview"
                            className='w-full max-w-[340px] md:max-w-md relative z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3'
                        />

                        {/* Interactive Badge */}
                        <div className='absolute -bottom-4 -left-4 md:-left-12 bg-white text-gray-900 p-4 rounded-3xl shadow-2xl z-20 flex items-center gap-3 animate-bounce shadow-orange-500/20 hidden sm:flex'>
                            <div className='w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500'>
                                <MdGetApp size={24} />
                            </div>
                            <div>
                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1'>New Version</p>
                                <p className='text-sm font-black'>v2.4.0 Available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CTASection
