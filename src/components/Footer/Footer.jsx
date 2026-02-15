import React from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='text-[#d9d9d9] bg-[#323232] flex flex-col items-center gap-5 p-8 pt-16 md:pt-24 mt-24 animate-fadeIn' id='footer'>
            <div className='w-full grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-20 text-center md:text-left'>
                <div className="flex flex-col items-center md:items-start gap-6">
                    <h1 className='text-orange-500 text-4xl font-extrabold tracking-tight'>LiteKitchen</h1>
                    <p className='max-w-md text-gray-400 leading-relaxed text-sm md:text-base'>Experience the joy of fresh, healthy, and delicious meals delivered straight to your doorstep. We are committed to bringing you the best flavors from across the world.</p>
                    <div className="flex gap-4 mt-2">
                        <div className='w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 hover:scale-110'>
                            <FaFacebookF />
                        </div>
                        <div className='w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 hover:scale-110'>
                            <FaTwitter />
                        </div>
                        <div className='w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 hover:scale-110'>
                            <FaLinkedinIn />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-start gap-5">
                    <h2 className='text-white text-xl font-bold tracking-wider mb-2'>COMPANY</h2>
                    <ul className='list-none space-y-3'>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Home</li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>About us</li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Delivery</li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Privacy policy</li>
                    </ul>
                </div>
                <div className="flex flex-col items-center md:items-start gap-5">
                    <h2 className='text-white text-xl font-bold tracking-wider mb-2'>GET IN TOUCH</h2>
                    <ul className='list-none space-y-3'>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2 justify-center md:justify-start'>
                            +1-212-456-7890
                        </li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2 justify-center md:justify-start'>
                            contact@litekitchen.com
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-700 my-6 md:my-8"></div>
            <p className="text-center text-sm text-gray-500 font-medium">Copyright 2024 © LiteKitchen.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
