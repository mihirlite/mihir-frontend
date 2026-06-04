import React from 'react'

const ShippingPolicy = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        Shipping & Delivery Policy
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>SD</span>
                    <h2 className='text-3xl font-black text-gray-800'>Delivery Policy</h2>
                </div>

                <p className='text-gray-400 font-bold uppercase tracking-widest text-xs mb-10'>Effective Date: March 1, 2026</p>

                <div className='space-y-10'>
                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            1. General Information
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            At <span className='font-bold text-orange-500'>FlavoHub</span>, we are committed to delivering your orders fresh and on time. Since we deal with perishable food items, our delivery process is optimized for speed and safety.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            2. Delivery Timelines
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            We strive to deliver all orders within <span className='font-bold text-gray-800'>45–60 minutes</span> from the time the order is confirmed, depending on your distance from our kitchen and current order volume.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            3. Service Areas
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            We currently provide delivery services in <span className='font-bold text-gray-800'>Paschim Medinipur, West Bengal</span> and surrounding areas within our specified radius. If your location is outside our delivery zone, you will be notified at the time of checkout.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            4. Delivery Charges
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Delivery charges are calculated based on the distance from our kitchen. The exact delivery fee will be displayed on the checkout page before you complete your payment.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            5. Order Tracking
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Once your order is out for delivery, you can track it via the "Track Order" feature on our website. You will also receive an OTP that must be shared with the delivery partner to verify delivery completion.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            6. Failed Delivery Attempts
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            If a delivery cannot be completed due to incorrect address information or unavailability of the recipient, the order may be cancelled without a refund due to the perishable nature of the food. Please ensure someone is available to receive the order at the provided address.
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

export default ShippingPolicy
