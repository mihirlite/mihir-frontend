import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='text-[#d9d9d9] bg-[#323232] flex flex-col items-center gap-5 p-8 pt-16 md:pt-24 mt-24 animate-fadeIn' id='footer'>
            <div className='w-full grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-20 text-center md:text-left'>
                <div className="flex flex-col items-center md:items-start gap-6">
                    <img src={assets.logo} alt="Flavohub" className='w-36 md:w-40 brightness-0 invert opacity-90' />
                    <p className='max-w-md text-gray-400 leading-relaxed text-sm md:text-base'>Experience the joy of fresh, healthy, and delicious meals delivered straight to your doorstep. We are committed to bringing you the best flavors from across the world.</p>
                </div>
                <div className="flex flex-col items-center md:items-start gap-5">
                    <h2 className='text-white text-xl font-bold tracking-wider mb-2'>COMPANY</h2>
                    <ul className='list-none space-y-3'>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Home</li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Menu</li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Contact</li>
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
                            contact@flavohub.com
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-700 my-6 md:my-8"></div>
            <p className="text-center text-sm text-gray-500 font-medium">Copyright 2024 © Flavohub.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
