import React, { useState, useEffect, useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import TodayOrders from '../Admin/TodayOrders/TodayOrders'
import Login from './Login'
import 'react-toastify/dist/ReactToastify.css';
import { MdLogout } from "react-icons/md";
import logo from '../../assets/logo/logo.png'

const Delivery = () => {
    const { url, token, setToken, setRefreshToken, setRole } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        setToken("");
        setRefreshToken("");
        setRole("");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/delivery");
    }

    if (!token) {
        return <Login setToken={setToken} url={url} />
    }

    return (
        <div className='min-h-screen bg-gray-50/50'>
            
            {/* Delivery Header */}
            <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-2 px-4 md:px-6'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <img src={logo} alt="Logo" className='w-24 md:w-32 object-contain' />
                        <span className="hidden sm:block font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs tracking-widest uppercase">Delivery Portal</span>
                    </div>

                    <div className='relative flex items-center gap-4 md:gap-6'>
                        <button
                            onClick={logout}
                            className='flex items-center gap-2 p-2 px-4 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl transition-all font-bold text-sm'
                        >
                            <MdLogout size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className='w-full flex relative p-2 sm:p-4 lg:p-6 gap-4 sm:gap-6 lg:gap-8 justify-center'>
                <main className='w-full max-w-7xl overflow-hidden'>
                    <div className='bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-3 sm:p-5 lg:p-8 overflow-x-auto custom-scrollbar min-h-[calc(100vh-120px)]'>
                        <Routes>
                            <Route path='/' element={<Navigate to='today-orders' />} />
                            <Route path='/today-orders' element={<TodayOrders url={url} token={token} role="delivery" />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Delivery
