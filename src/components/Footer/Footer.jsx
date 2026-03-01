import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import logo from '../../assets/logo/logo.png'
import { StoreContext } from '../../context/StoreContext'

const Footer = () => {
    const navigate = useNavigate();
    const { setVegOnly, setNonVegOnly } = useContext(StoreContext);

    const handleNavClick = (id, isMenu = false) => {
        if (isMenu) {
            setVegOnly(false);
            setNonVegOnly(false);
        }

        if (window.location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else if (id === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (id === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100);
        }
    }

    return (
        <div className='text-[#d9d9d9] bg-[#323232] flex flex-col items-center gap-5 p-8 pt-16 md:pt-24 mt-0 animate-fadeIn' id='footer'>
            <div className='w-full grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-20 text-center md:text-left'>
                <div className="flex flex-col items-center md:items-start gap-6">
                    <img src={logo} alt="Flavohub" className='w-36 md:w-40 brightness-0 invert opacity-90' />
                    <p className='max-w-md text-gray-400 leading-relaxed text-sm md:text-base'>Enjoy authentic village-style Veg & Non-Veg Thalis prepared fresh every day. FlavoHub brings you homemade flavors, quality ingredients, and the warmth of true home cooking.</p>
                </div>
                <div className="flex flex-col items-center md:items-start gap-5">
                    <h2 className='text-white text-xl font-bold tracking-wider mb-2'>Useful Links</h2>
                    <ul className='list-none space-y-3'>
                        <li onClick={() => handleNavClick('top')} className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Home</li>
                        <li onClick={() => handleNavClick('all-foods', true)} className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Menu</li>
                        <li onClick={() => handleNavClick('footer')} className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Contact</li>
                        <Link to='/terms'><li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1'>Terms & Conditions</li></Link>
                    </ul>
                </div>
                <div className="flex flex-col items-center md:items-start gap-5">
                    <h2 className='text-white text-xl font-bold tracking-wider mb-2'>GET IN TOUCH</h2>
                    <ul className='list-none space-y-3'>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2 justify-center md:justify-start'>
                            +91 8436217390
                        </li>
                        <li className='cursor-pointer text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2 justify-center md:justify-start'>
                            flavohub@gmail.com
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-700 my-6 md:my-8"></div>
            <p className="text-center text-sm text-gray-500 font-medium">Copyright 2026 © FlavoHub.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
