import React from 'react'
import { MdOutlineDeliveryDining, MdOutlineVerifiedUser } from "react-icons/md";
import { BiLeaf } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

const WhyChooseUs = () => {
    const features = [
        {
            icon: <MdOutlineDeliveryDining className='text-5xl text-orange-500' />,
            title: "Fast Delivery",
            description: "Get your cravings satisfied in no time with our lightning-fast delivery service."
        },
        {
            icon: <BiLeaf className='text-5xl text-green-500' />,
            title: "Fresh Ingredients",
            description: "We use only the freshest, handpicked ingredients to craft every single meal."
        },
        {
            icon: <MdOutlineVerifiedUser className='text-5xl text-blue-500' />,
            title: "Secure Payments",
            description: "Your transactions are always safe and encrypted with our secure payment gateway."
        },
        {
            icon: <AiFillStar className='text-5xl text-yellow-500' />,
            title: "4.8 Customer Rating",
            description: "Join thousands of happy customers who love our food and premium service."
        }
    ];

    return (
        <div className='mt-4 md:mt-6 mb-0 w-[92%] sm:w-full px-4 sm:px-6 md:w-[85%] lg:w-[80%] mx-auto' id='why-choose-us'>
            <div className='text-center mb-8 md:mb-12 animate-fadeIn'>
                <span className='text-orange-500 font-bold tracking-widest uppercase text-sm md:text-base mb-2 block'>Our Promise</span>
                <h2 className='text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-[#323232] mb-4 md:mb-6 tracking-tight'>
                    Why Choose <span className='text-orange-500'>Flavohub?</span>
                </h2>
                <div className='w-20 md:w-24 h-1.5 bg-gradient-to-r from-orange-500 to-orange-300 mx-auto rounded-full mb-5 md:mb-8'></div>
                <p className='text-gray-500 text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed'>
                    We don't just deliver food, we deliver experiences. Join millions of happy customers who trust us for their daily cravings.
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10'>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className='group relative p-5 xs:p-6 md:p-7 bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 transform hover:-translate-y-4 border border-gray-100/50 overflow-hidden'
                    >
                        {/* Decorative Background Blob */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${index === 0 ? 'bg-orange-500' :
                            index === 1 ? 'bg-green-500' :
                                index === 2 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}></div>

                        <div className={`
                            w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                            bg-gradient-to-br shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
                            ${index === 0 ? 'from-orange-50 to-orange-100' :
                                index === 1 ? 'from-green-50 to-green-100' :
                                    index === 2 ? 'from-blue-50 to-blue-100' : 'from-yellow-50 to-yellow-100'
                            }
                        `}>
                            <div className='transition-transform duration-300 transform group-hover:-translate-y-1'>
                                {feature.icon}
                            </div>
                        </div>

                        <h3 className='text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center group-hover:text-orange-500 transition-colors duration-300'>
                            {feature.title}
                        </h3>

                        <p className='text-gray-500 text-sm md:text-base leading-relaxed text-center opacity-80 group-hover:opacity-100 transition-opacity duration-300'>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WhyChooseUs

