import React from 'react'

const Disclaimer = () => {
    return (
        <div className='bg-[#fdfdfd] min-h-screen py-20 px-4 md:px-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 animate-fadeIn'>
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent'>
                        Disclaimer
                    </h1>
                    <div className='w-20 h-1.5 bg-orange-500 mx-auto rounded-full'></div>
                </div>

                <div className='flex items-center gap-4 mb-8'>
                    <span className='w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm'>DS</span>
                    <h2 className='text-3xl font-black text-gray-800'>Legal Disclaimer</h2>
                </div>

                <div className='space-y-10'>
                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            1. Accuracy of Information
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            The information provided by <span className='font-bold text-orange-500'>FlavoHub</span> on our website and mobile application is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty of any kind.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            2. Allergen Warning
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            While we strive to ensure accuracy in ingredient listings, our kitchens handle various allergens (nuts, dairy, gluten, etc.). Customers with severe allergies should exercise caution.
                        </p>
                    </div>

                    <div className='group'>
                        <h3 className='text-xl font-bold text-gray-800 mb-3 flex items-center gap-3'>
                            <span className='w-1.5 h-6 bg-orange-500 rounded-full transition-all group-hover:h-8'></span>
                            3. Food Temperature
                        </h3>
                        <p className='text-gray-600 leading-relaxed pl-5'>
                            Consumption of food delivered by us should be done immediately upon receipt to ensure safety and quality. We are not liable for issues arising from improper storage after delivery.
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

export default Disclaimer
