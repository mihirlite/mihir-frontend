import React from 'react'

const Terms = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>

                {/* Header */}
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        Terms & Conditions
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                {/* Terms & Conditions Section */}
                <section className='mb-20'>
                    <div className='flex items-center gap-4 mb-8'>
                        <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>TC</span>
                        <h2 className='text-3xl font-black text-gray-800'>Terms & Conditions</h2>
                    </div>

                    <p className='text-gray-400 font-bold uppercase tracking-widest text-xs mb-10'>Effective Date: March 1, 2026</p>

                    <div className='space-y-10'>
                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                1. Acceptance of Terms
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                By using <span className='font-bold text-orange-500'>FlavoHub</span>, you agree to these Terms & Conditions.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                2. Eligibility
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                Users must be at least 18 years old.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                3. Orders & Payments
                            </h3>
                            <ul className='text-gray-600 leading-relaxed pl-5 list-disc space-y-2 marker:text-orange-500'>
                                <li>Orders are subject to availability.</li>
                                <li>Payments may be made via online gateway or Cash on Delivery.</li>
                                <li>Orders cannot be cancelled once preparation begins.</li>
                            </ul>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                4. Delivery
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                Delivery times are estimates and may vary due to external factors.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                5. Cancellation & Refund
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                Refunds (if applicable) will be processed within 5–7 working days.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                6. Limitation of Liability
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                Our liability shall not exceed the order value.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                7. Intellectual Property
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                All website content is property of <span className='font-bold text-orange-500'>FlavoHub</span>.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                8. Contact Information
                            </h3>
                            <div className='text-gray-600 leading-relaxed pl-5 space-y-2'>
                                <p><span className='font-bold text-gray-800'>Email:</span> flabohub@gmail.com</p>
                                <p><span className='font-bold text-gray-800'>Phone:</span> +91 8436217390</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className='border-gray-50 mb-20' />

                {/* Privacy Policy Section */}
                <section>
                    <div className='flex items-center gap-4 mb-8'>
                        <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>PP</span>
                        <h2 className='text-3xl font-black text-gray-800'>Privacy Policy</h2>
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
                                5. Data Security
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                We implement reasonable security measures to protect your data.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                6. User Rights
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                You may access, update, or request deletion of your personal information by contacting us at <span className='font-bold text-orange-500'>flavohub@gmail.com</span>.
                            </p>
                        </div>

                        <div className='group'>
                            <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                                <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                                7. Governing Law
                            </h3>
                            <p className='text-gray-600 leading-relaxed pl-5'>
                                This policy is governed by the laws of India.
                            </p>
                        </div>
                    </div>
                </section>

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

export default Terms
