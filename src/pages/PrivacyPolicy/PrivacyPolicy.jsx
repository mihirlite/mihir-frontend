import React from 'react'

const PrivacyPolicy = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        Privacy Policy
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>PP</span>
                    <h2 className='text-3xl font-black text-gray-800'>Data Privacy</h2>
                </div>

                <p className='text-gray-400 font-bold uppercase tracking-widest text-xs mb-10'>Effective Date: March 1, 2026</p>

                <div className='space-y-10'>
                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            1. Introduction
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Welcome to <span className='font-bold text-orange-500'>FlavoHub</span>. We operate a food delivery platform connecting customers with restaurants and delivery partners. This Privacy Policy explains how we collect, use, and protect your information.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            2. Information We Collect
                        </h3>
                        <ul className='text-gray-600 leading-relaxed pl-5 list-disc space-y-2 marker:text-orange-500'>
                            <li>Name, phone number, email address</li>
                            <li>Delivery address</li>
                            <li>Order history and transaction details</li>
                            <li>Device and technical information (IP address, browser type)</li>
                            <li>Location data (with permission)</li>
                        </ul>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            3. How We Use Information
                        </h3>
                        <ul className='text-gray-600 leading-relaxed pl-5 list-disc space-y-2 marker:text-orange-500'>
                            <li>To process and deliver orders</li>
                            <li>To provide customer support</li>
                            <li>To improve our services</li>
                            <li>To send promotional offers (with consent)</li>
                        </ul>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            4. Sharing of Information
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            We may share information with restaurants, delivery partners, payment gateways, and authorities if legally required. We do not sell personal data.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            5. Contact Us
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            If you have any questions about this Privacy Policy, please contact us at <span className='font-bold text-gray-800'>flavohub@gmail.com</span> or call <span className='font-bold text-gray-800'>+91 8436217390</span>.
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

export default PrivacyPolicy
