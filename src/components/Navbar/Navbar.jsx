import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { HiOutlineUser, HiOutlineLogout, HiOutlineBell } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiMenu, FiX, FiPackage, FiBox, FiLogOut, FiShoppingBag, FiBell, FiSearch } from "react-icons/fi";
import logo from '../../assets/logo/logo.png';
import './NotificationPanel.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
    const [menu, setMenu] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { getTotalCartAmount, cartItems, token, setToken, setShowLogin, setVegOnly, setNonVegOnly, url, isWithinSchedule, generalSettings } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + "/api/notification/user", {}, { headers: { token } });
            if (response.data.success) {
                setNotifications(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
            return () => clearInterval(interval);
        }
    }, [token]);

    const markRead = async (id) => {
        try {
            await axios.post(url + "/api/notification/read", { id }, { headers: { token } });
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    }

    const unreadCount = (notifications || []).filter(n => !n.read).length;

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    const handleHomeClick = () => {
        setMenu("home");
        setIsMobileMenuOpen(false);
        setVegOnly(false);
        setNonVegOnly(false);
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    }

    const handleNavClick = (id, menuName) => {
        setMenu(menuName);
        setIsMobileMenuOpen(false);
        if (menuName === 'menu') {
            setVegOnly(false);
            setNonVegOnly(false);
            setSearchQuery("");
        }
        if (window.location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    return (
        <div className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ease-in-out`}>
            {/* After Hours Banner */}
            {!isWithinSchedule && (
                <div className='bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2.5 px-4 text-center animate-fadeIn shadow-lg relative z-[1001]'>
                    <p className='text-[11px] sm:text-xs font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2'>
                        <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
                        Order time is closed. Orders placed now will be processed from {generalSettings?.onlineFrom || "morning"}.
                    </p>
                </div>
            )}
            
            <div className={`transition-all duration-300 ease-in-out ${isScrolled ? 'py-1' : 'py-2'}`}>
                <div className={`mx-auto px-4 sm:px-6 lg:w-[94%] xl:w-[90%] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm rounded-none sm:rounded-b-[1rem] border-b border-gray-100' : 'bg-transparent'}`}>
                    <nav className='flex justify-between items-center h-20 sm:h-20 px-2 sm:px-4 relative'>

                        {/* Logo */}
                        <div onClick={handleHomeClick} className='flex items-center cursor-pointer group'>
                            <img src={logo} alt="FlavoHub" className='h-16 sm:h-[72px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none' />
                        </div>

                        {/* Right Actions: Cart & Menu */}
                        <div className='flex items-center gap-2 sm:gap-4'>
                            
                            {/* Profile / Notifications if logged in */}
                            {token && (
                                <div className='hidden sm:flex items-center gap-2 mr-2'>
                                    {/* Notifications Dropdown Container */}
                                    <div className='relative'>
                                        <div onClick={() => { setShowNotifications(!showNotifications); setShowProfileDropdown(false); }} className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${showNotifications ? 'bg-orange-500 text-white shadow-lg' : 'text-[#323232] hover:bg-orange-50 hover:text-orange-500'}`}>
                                            <FiBell size={20} />
                                            {unreadCount > 0 && <span className='notif-badge-dot'></span>}
                                        </div>
                                        {showNotifications && (
                                            <div className="notification-dropdown">
                                                <div className="notification-header">
                                                    Notifications <span>{unreadCount} New</span>
                                                </div>
                                                <div className="notification-list">
                                                    {notifications.length === 0 ? (
                                                        <p className="p-10 text-center text-gray-400 font-bold italic text-sm">Delicious updates coming soon!</p>
                                                    ) : (
                                                        notifications.map(notif => (
                                                            <div key={notif._id} onClick={() => { markRead(notif._id); navigate('/myorders'); setShowNotifications(false); }} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                                                <span className="notif-msg font-bold mb-1">{notif.message}</span>
                                                                <span className="notif-date flex justify-between items-center text-[10px]">
                                                                    {new Date(notif.date).toLocaleDateString()} at {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    {!notif.read && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>}
                                                                </span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Dropdown */}
                                    <div className='relative'>
                                        <div onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifications(false); }} className={`p-2 rounded-xl cursor-pointer transition-all duration-300 active:scale-90 ${showProfileDropdown ? 'bg-gray-100/80 scale-105' : 'hover:bg-gray-50'}`}>
                                            <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-black text-xs uppercase border border-white'>
                                                <HiOutlineUser size={20} />
                                            </div>
                                        </div>
                                        {showProfileDropdown && (
                                            <ul className='absolute right-0 mt-5 w-56 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white py-3 animate-fadeIn flex flex-col p-2 gap-1'>
                                                <li onClick={() => { navigate('/myorders'); setShowProfileDropdown(false); }} className='flex items-center gap-3 px-5 py-3.5 hover:bg-orange-50 rounded-2xl cursor-pointer text-gray-700 font-black text-sm transition-all group'>
                                                    <FiPackage className='text-orange-500 transition-transform group-hover:scale-110' size={18} /> Orders
                                                </li>
                                                <div className='mx-4 h-[1px] bg-gray-50'></div>
                                                <li onClick={() => { logout(); setShowProfileDropdown(false); }} className='flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 rounded-2xl cursor-pointer text-gray-700 font-black text-sm transition-all group'>
                                                    <FiLogOut className='text-red-500 transition-transform group-hover:scale-110' size={18} /> Logout
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Cart */}
                            <Link to='/cart' aria-label="View shopping cart" className='relative p-2.5 rounded-xl text-[#323232] hover:bg-orange-50 hover:text-orange-500 transition-all active:scale-90 active:rotate-3'>
                                <FiShoppingBag size={24} />
                                {getTotalCartAmount() > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-lg animate-bounce-slow'>
                                        {Object.keys(cartItems || {}).filter(id => cartItems[id] > 0).length}
                                    </span>
                                )}
                            </Link>

                            {/* Menu Icon */}
                            <div onClick={() => setIsMobileMenuOpen(true)} className='p-2 rounded-xl bg-gray-50 text-gray-800 hover:bg-orange-50 hover:text-orange-500 active:scale-95 transition-all cursor-pointer'>
                                <FiMenu size={24} />
                            </div>
                        </div>

                    </nav>
                </div>
            </div>

            {/* Premium Mobile Sidebar */}
            <div className={`fixed inset-0 z-[2000] transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
                <div onClick={() => setIsMobileMenuOpen(false)} className={`absolute inset-0 transition-all duration-700 backdrop-blur-md ${isMobileMenuOpen ? 'bg-black/40' : 'bg-transparent'}`}></div>
                <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    {/* Sidebar Header */}
                    <div className='flex justify-between items-center p-8 pb-4'>
                        <img src={logo} alt="FlavoHub" className='h-12 w-auto object-contain' />
                        <div onClick={() => setIsMobileMenuOpen(false)} className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-orange-500 active:bg-orange-50 transition-all'>
                            <FiX size={26} />
                        </div>
                    </div>

                    {/* Sidebar Nav */}
                    <div className='flex-1 py-4 px-6 overflow-y-auto'>
                        <div className='flex flex-col gap-2'>
                            {[
                                { name: "Home", id: "home", action: handleHomeClick },
                                { name: "Menu", id: "all-foods", menuName: "menu" },
                                { name: "Contact", id: "footer", menuName: "contact-us" }
                            ].map((item) => (
                                <div
                                    key={item.name}
                                    onClick={() => { if (item.action) item.action(); else handleNavClick(item.id, item.menuName); setIsMobileMenuOpen(false); }}
                                    className={`px-6 py-5 rounded-[2rem] text-xl font-black transition-all active:scale-[0.98] ${menu === (item.menuName || item.id) ? 'bg-orange-500 text-white shadow-xl shadow-orange-100' : 'text-gray-800 hover:bg-orange-50'}`}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className='p-8 mt-auto bg-gray-50/50 border-t border-gray-100'>
                        {!token ? (
                            <button onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }} className='w-full bg-[#1a1a1a] text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-gray-200 active:scale-95 transition-all uppercase tracking-widest'>
                                Get Started
                            </button>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                <button onClick={() => { navigate('/myorders'); setIsMobileMenuOpen(false); }} className='w-full bg-white text-gray-800 py-4.5 rounded-[2rem] font-black flex items-center justify-center gap-3 border border-gray-100 shadow-md active:scale-95 transition-all text-lg'>
                                    <FiBox className='text-orange-500' size={24} /> My Orders
                                </button>
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className='w-full bg-red-50 text-red-600 py-4.5 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-100/30 text-lg uppercase tracking-wider'>
                                    Logout
                                </button>
                            </div>
                        )}
                        <p className='text-center mt-6 text-[10px] text-gray-400 font-bold tracking-widest uppercase'>FlavoHub &copy; 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
