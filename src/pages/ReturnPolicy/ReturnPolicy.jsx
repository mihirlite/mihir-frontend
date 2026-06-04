import React from 'react'

const ReturnPolicy = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        Return Policy
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>RP</span>
                    <h2 className='text-3xl font-black text-gray-800'>Returns</h2>
                </div>

                <div className='space-y-10'>
                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            1. Perishable Items
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Due to the perishable nature of our food products, we cannot accept returns once the food has been delivered and the delivery has been verified via OTP.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            2. Quality Issues
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            If you receive food that is not up to our quality standards or is incorrect, please contact us immediately upon delivery. We will investigate and provide a suitable resolution.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            3. Incorrect Orders
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            In case of missing items or incorrect dishes, please report the issue within 30 minutes of delivery for a replacement or adjustment.
                        </p>
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

export default ReturnPolicy
