import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdAddCircleOutline, MdFormatListBulleted, MdOutlineShoppingCart, MdPeopleOutline, MdConfirmationNumber, MdLocalShipping, MdAccountBalanceWallet, MdDashboard, MdToday, MdMonetizationOn, MdSettings, MdCloudUpload, MdStar, MdCalendarMonth } from "react-icons/md";
import logo from '../../assets/logo/logo.png'

const Sidebar = ({ isOpen, setIsOpen, logout }) => {
    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:sticky top-0 lg:top-24 left-0 h-screen lg:h-[calc(100vh-100px)] 
                w-[260px] sm:w-[280px] bg-white border-r border-gray-100 shadow-2xl lg:shadow-none
                z-50 lg:z-0 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-6">
                    <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <img src={logo} alt="Logo" className='w-28 object-contain' />
                        <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-orange-500 bg-gray-50 rounded-xl transition-all">
                            ✕
                        </button>
                    </div>

                    <h3 className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 hidden lg:block'>Menu</h3>

                    <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                        <NavLink
                            to='/master-control-gate/dashboard'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdDashboard size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Dashboard</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/today-orders'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdToday size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Today Orders</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/today-monthly'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdLocalShipping size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Today Monthly</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/monthly-orders'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdMonetizationOn size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Monthly Orders</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/tracking-sheet'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdCalendarMonth size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Tracking Sheet</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/add'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdAddCircleOutline size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Add Items</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/list'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdFormatListBulleted size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>List Items</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/orders'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdOutlineShoppingCart size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Orders</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/users'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdPeopleOutline size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Users</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/coupons'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdConfirmationNumber size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Coupon Code</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/delivery'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdLocalShipping size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Delivery Fee</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/gst-charges'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdAccountBalanceWallet size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>GST & Charges</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/reviews'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdFormatListBulleted size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Feedbacks</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/subscription-price'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdMonetizationOn size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide leading-tight break-words max-w-[160px]'>Monthly Subscription Price</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/settings'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdSettings size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>General Settings</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/master-control-gate/hero-images'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <MdCloudUpload size={24} className='group-hover:scale-110 transition-transform duration-300' />
                                    <span className='font-bold tracking-wide'>Hero Images</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </>
                            )}
                        </NavLink>

                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 py-4 px-6 rounded-2xl hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-300 group"
                        >
                            <span className="font-bold tracking-wide">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
