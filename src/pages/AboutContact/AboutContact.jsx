import React from 'react'

const AboutContact = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>
                
                {/* About Section */}
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        About & Contact
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>AU</span>
                    <h2 className='text-3xl font-black text-gray-800'>About FlavoHub</h2>
                </div>

                <div className='space-y-6 text-gray-600 leading-relaxed mb-16'>
                    <p>
                        Welcome to <span className='font-bold text-orange-500'>FlavoHub</span>, your destination for authentic, homemade village-style food. We believe that the best meals are the ones prepared with love, tradition, and fresh ingredients.
                    </p>
                    <p>
                        Our mission is to bring the rich flavors of traditional kitchens to your doorstep, ensuring every bite feels like home. Whether you're craving a robust Veg Thali or a flavorful Non-Veg experience, we've got you covered.
                    </p>
                </div>

                <hr className='border-gray-50 mb-16' />

                {/* Contact Section */}
                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>CU</span>
                    <h2 className='text-3xl font-black text-gray-800'>Contact Us</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    <div className='bg-orange-50 p-8 rounded-3xl border border-orange-100'>
                        <h4 className='text-orange-600 font-black uppercase tracking-widest text-xs mb-4'>Direct Support</h4>
                        <div className='space-y-4'>
                            <div>
                                <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Phone</p>
                                <p className='text-lg font-black text-gray-800'>+91 8436217390</p>
                            </div>
                            <div>
                                <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Email</p>
                                <p className='text-lg font-black text-gray-800'>flavohub@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-gray-50 p-8 rounded-3xl border border-gray-100'>
                        <h4 className='text-gray-400 font-black uppercase tracking-widest text-xs mb-4'>Location</h4>
                        <div>
                            <p className='text-[10px] text-gray-400 font-bold uppercase mb-1'>Address</p>
                            <p className='text-lg font-black text-gray-800 leading-tight'>Village Kitchen Hub,<br />Paschim Medinipur,<br />West Bengal, India</p>
                        </div>
                    </div>
                </div>

                <div className='mt-20 pt-10 border-t border-gray-50 text-center'>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className='bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-200 uppercase tracking-widest text-xs'
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AboutContact
