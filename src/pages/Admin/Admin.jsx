import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Add from './Add/Add'
import AddCombo from './AddCombo/AddCombo'
import List from './List/List'
import Edit from './Edit/Edit'
import Orders from './Orders/Orders'
import Users from './Users/Users'
import Coupons from './Coupons/Coupons'
import DeliveryFee from './DeliveryFee/DeliveryFee'
import GSTCharges from './GSTCharges/GSTCharges'
import Reviews from './Reviews/Reviews'
import Login from './Login'
import Dashboard from './Dashboard/Dashboard'
import TodayOrders from './TodayOrders/TodayOrders'
import TodayMonthlyDelivery from './TodayMonthlyDelivery/TodayMonthlyDelivery'
import MonthlyOrders from './MonthlyOrders/MonthlyOrders'
import SubscriptionPrice from './SubscriptionPrice/SubscriptionPrice'
import Settings from './Settings/Settings'
import HeroImageManager from './HeroImageManager/HeroImageManager'
import Rewards from './Rewards/Rewards'
import TrackingSheet from './TrackingSheet/TrackingSheet'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdNotificationsNone, MdNotificationsActive, MdMenu, MdClose, MdLogout } from "react-icons/md";
import axios from 'axios';
import logo from '../../assets/logo/logo.png'
import '../../components/Navbar/NotificationPanel.css';

const Admin = () => {
    const { url, token, role, setToken, setRefreshToken, setRole } = useContext(StoreContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + "/api/notification/admin", {}, { headers: { token } });
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
            if (error.response && error.response.status === 403) {
                try {
                    toast.error("Admin session invalid. Please login again.");
                } catch (toastErr) {
                    console.error("Toast failed:", toastErr);
                }
                logout();
            }
        }
    }

    const markRead = async (id) => {
        try {
            await axios.post(url + "/api/notification/read", { id }, { headers: { token } });
            fetchNotifications();
        } catch (error) {
            console.error("Error marking as read");
        }
    }

    const logout = () => {
        setToken("");
        setRefreshToken("");
        setRole("");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        navigate("/master-control-gate");
    }

    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [token]);

    if (!token || role !== 'admin') {
        return <Login setToken={setToken} url={url} />
    }

    return (
        <div className='min-h-screen bg-gray-50/50'>
            
            {/* Admin Header */}
            <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-2 px-4 md:px-6'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className='lg:hidden p-2 hover:bg-orange-50 rounded-xl transition-all text-gray-600'
                        >
                            {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                        </button>
                        <img src={logo} alt="Logo" className='w-24 md:w-32 object-contain' />
                    </div>

                    <div className='relative flex items-center gap-4 md:gap-6'>
                        <div onClick={() => setShowNotif(!showNotif)} className='p-2 cursor-pointer text-[#323232] hover:bg-orange-50 rounded-xl transition-all relative'>
                            {notifications.some(n => !n.read) ?
                                <MdNotificationsActive className='text-2xl text-orange-500 animate-bounce' /> :
                                <MdNotificationsNone className='text-2xl text-gray-600' />
                            }
                            {notifications.some(n => !n.read) && <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>}
                        </div>

                        <button
                            onClick={logout}
                            className='hidden md:flex items-center gap-2 p-2 px-4 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl transition-all font-bold text-sm'
                        >
                            <MdLogout size={20} />
                            Logout
                        </button>

                        <button
                            onClick={logout}
                            className='md:hidden p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl transition-all'
                        >
                            <MdLogout size={22} />
                        </button>

                        {showNotif && (
                            <div className='notification-dropdown !top-14 border border-gray-100 animate-fadeIn right-0 w-[300px] md:w-[350px] shadow-2xl'>
                                <div className='notification-header flex items-center justify-between'>
                                    <span>Admin Alerts</span>
                                    <span className='text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full'>
                                        {notifications.filter(n => !n.read).length} New
                                    </span>
                                </div>
                                <div className='notification-list max-h-[400px] scrollbar-hide'>
                                    {notifications.length === 0 ? (
                                        <div className='p-8 text-center'>
                                            <p className='text-gray-400 text-sm'>No new orders</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif, index) => (
                                            <div key={index} onClick={() => { markRead(notif._id); setShowNotif(false); }} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                                <p className='text-sm mb-1'>{notif.message}</p>
                                                <span className='notif-date'>{new Date(notif.date).toLocaleString()}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className='w-full flex relative p-2 sm:p-4 lg:p-6 gap-4 sm:gap-6 lg:gap-8'>
                {/* Sidebar Overlay for Mobile */}
                {isSidebarOpen && (
                    <div
                        className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden'
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} logout={logout} />

                <main className='flex-1 w-full overflow-hidden'>
                    <div className='bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-3 sm:p-5 lg:p-8 overflow-x-auto custom-scrollbar min-h-full'>
                        <Routes>
                            <Route path='/' element={<Navigate to='dashboard' />} />
                            <Route path='/dashboard' element={<Dashboard url={url} token={token} />} />
                            <Route path='/today-orders' element={<TodayOrders url={url} token={token} role="admin" />} />
                            <Route path='/today-monthly' element={<TodayMonthlyDelivery url={url} token={token} />} />
                            <Route path='/monthly-orders' element={<MonthlyOrders url={url} token={token} />} />
                            <Route path='/subscription-price' element={<SubscriptionPrice url={url} token={token} />} />
                            <Route path='/add' element={<Add url={url} token={token} />} />
                            <Route path='/list' element={<List url={url} token={token} />} />
                            <Route path='/edit/:id' element={<Edit url={url} token={token} />} />
                            <Route path='/add-combo/:id' element={<AddCombo url={url} token={token} />} />
                            <Route path='/orders' element={<Orders url={url} token={token} />} />
                            <Route path='/users' element={<Users url={url} token={token} />} />
                            <Route path='/coupons' element={<Coupons url={url} token={token} />} />
                            <Route path='/delivery' element={<DeliveryFee url={url} token={token} />} />
                            <Route path='/gst-charges' element={<GSTCharges url={url} token={token} />} />
                            <Route path='/reviews' element={<Reviews url={url} token={token} />} />
                            <Route path='/settings' element={<Settings url={url} token={token} />} />
                            <Route path='/hero-images' element={<HeroImageManager url={url} token={token} />} />
                            <Route path='/tracking-sheet' element={<TrackingSheet url={url} token={token} />} />
                            <Route path='/rewards' element={<Rewards url={url} token={token} />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Admin
