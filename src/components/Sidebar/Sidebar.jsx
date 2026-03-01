import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdAddCircleOutline, MdFormatListBulleted, MdOutlineShoppingCart, MdPeopleOutline, MdConfirmationNumber, MdLocalShipping, MdAccountBalanceWallet } from "react-icons/md";
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
                w-[280px] bg-white border-r border-gray-100/50 shadow-2xl lg:shadow-none
                z-50 lg:z-0 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-6">
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <img src={logo} alt="Logo" className='w-24 object-contain' />
                        <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-orange-500">
                            ✕
                        </button>
                    </div>

                    <h3 className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 hidden lg:block'>Menu</h3>

                    <div className="flex flex-col gap-2">
                        <NavLink
                            to='/admin/add'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdAddCircleOutline size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>Add Items</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>

                        <NavLink
                            to='/admin/list'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdFormatListBulleted size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>List Items</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>

                        <NavLink
                            to='/admin/orders'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdOutlineShoppingCart size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>Orders</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>

                        <NavLink
                            to='/admin/users'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdPeopleOutline size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>Users</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>

                        <NavLink
                            to='/admin/coupons'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdConfirmationNumber size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>Coupon Code</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>

                        <NavLink
                            to='/admin/delivery'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdLocalShipping size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>Delivery Fee</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>

                        <NavLink
                            to='/admin/gst-charges'
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-300 group
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                                    : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"}
                            `}
                        >
                            <MdAccountBalanceWallet size={24} className='group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-bold tracking-wide'>GST & Charges</span>
                            {({ isActive }) => isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        </NavLink>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 py-4 px-6 rounded-2xl hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-300 group"
                        >
                            {/* Assuming specific logic for logout icon or just button */}
                            <span className="font-bold tracking-wide">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
