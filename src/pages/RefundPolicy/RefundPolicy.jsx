import React from 'react'

const RefundPolicy = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        Refund Policy
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>RF</span>
                    <h2 className='text-3xl font-black text-gray-800'>Refunds</h2>
                </div>

                <div className='space-y-10'>
                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            1. Eligibility for Refunds
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Refunds are initiated only in cases of:
                            <ul className='list-disc pl-5 mt-2 space-y-1'>
                                <li>Order cancellation before preparation starts.</li>
                                <li>Unavailability of ordered items.</li>
                                <li>Major quality concerns verified by our team.</li>
                            </ul>
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            2. Processing Time
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Approved refunds will be processed within 5–7 working days to the original payment method. For Cash on Delivery, refunds may be provided as store credit or via bank transfer.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            4. Cancellation Policy
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Customers can cancel their order within <span className='font-bold text-gray-800'>2 minutes</span> of placing it or before the kitchen starts preparation. Once preparation has begun, cancellations will not be accepted, and no refund will be provided.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            5. Contact for Refunds
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            For any refund-related queries, please email us at <span className='font-bold text-gray-800'>flavohub@gmail.com</span> with your Order ID and reason for the refund request.
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

export default RefundPolicy
