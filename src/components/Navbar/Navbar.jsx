import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { CiSearch } from "react-icons/ci";
import { FiShoppingBag, FiUser, FiHeart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { MdOutlineHistory, MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
import axios from 'axios';
import './NotificationPanel.css';

const Navbar = ({ setShowLogin, searchQuery, setSearchQuery }) => {
    const [menu, setMenu] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { getTotalCartAmount, token, setToken, vegOnly, setVegOnly, cartItems, url } = useContext(StoreContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const navigate = useNavigate();

    // Handle scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
        setIsMobileMenuOpen(false);
    }

    const handleHomeClick = () => {
        setMenu("home");
        setIsMobileMenuOpen(false);
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    }

    const handleNavClick = (id, menuName) => {
        setMenu(menuName);
        setIsMobileMenuOpen(false);

        if (window.location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            // Use setTimeout to allow navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + "/api/notification/user", {}, { headers: { token } });
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching notifications");
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

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${isScrolled ? 'py-3 bg-white/90 backdrop-blur-xl shadow-lg border-b border-orange-50' : 'py-5 bg-transparent'}`}>
            <nav className='flex justify-between items-center w-[92%] md:w-[85%] lg:w-[80%] m-auto'>
                {/* Logo */}
                <div onClick={handleHomeClick} className='flex items-center gap-2 cursor-pointer group flex-1 lg:flex-none justify-center lg:justify-start'>
                    <h1 className='text-3xl font-black text-orange-500 tracking-tighter transition-transform group-hover:scale-105'>
                        LiteKitchen
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <ul className='hidden lg:flex list-none gap-10 text-[#494949] font-bold text-[15px]'>
                    <li>
                        <span onClick={handleHomeClick} className={`${menu === "home" ? "text-orange-500" : "hover:text-orange-500"} cursor-pointer transition-all duration-300 relative group py-2`}>
                            Home
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-left ${menu === "home" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                        </span>
                    </li>
                    <li>
                        <span onClick={() => handleNavClick("explore-menu", "menu")} className={`${menu === "menu" ? "text-orange-500" : "hover:text-orange-500"} cursor-pointer transition-all duration-300 relative group py-2`}>
                            Menu
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-left ${menu === "menu" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                        </span>
                    </li>
                    <li>
                        <span onClick={() => handleNavClick("footer", "contact-us")} className={`${menu === "contact-us" ? "text-orange-500" : "hover:text-orange-500"} cursor-pointer transition-all duration-300 relative group py-2`}>
                            Contact
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transition-transform duration-300 origin-left ${menu === "contact-us" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                        </span>
                    </li>
                </ul>

                {/* Right Side Actions */}
                <div className='flex items-center gap-3 md:gap-7'>
                    {/* Search Input in Navbar */}
                    <div className='relative hidden sm:flex items-center group'>
                        <CiSearch className='absolute left-3 text-xl text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300' />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='pl-10 pr-4 py-2.5 w-40 md:w-60 bg-gray-100/50 border border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 rounded-full text-sm outline-none transition-all duration-300'
                        />
                        {searchQuery && (
                            <FiX
                                className='absolute right-3 text-gray-400 cursor-pointer hover:text-orange-500 transition-colors'
                                onClick={() => setSearchQuery("")}
                            />
                        )}
                    </div>

                    <div className='flex items-center gap-4 md:gap-6'>
                        {/* Mobile Search Icon (Toggles an overlay if needed, but for now let's just use the desktop one logic for mobile menu) */}
                        <div className='sm:hidden cursor-pointer text-[#323232] hover:text-orange-500 transition-all active:scale-95' onClick={() => setIsMobileMenuOpen(true)}>
                            <CiSearch className='text-2xl' />
                        </div>

                        <div className='relative hidden sm:block'>
                            <Link to='/cart'>
                                <FiShoppingBag className='text-2xl cursor-pointer text-[#323232] hover:text-orange-500 transition-all hover:scale-110' />
                            </Link>
                            {getTotalCartAmount() > 0 && (
                                <span className='absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-bounce'>
                                    {Object.keys(cartItems).filter(id => cartItems[id] > 0).length}
                                </span>
                            )}
                        </div>

                        {token && (
                            <div className='relative flex items-center'>
                                <div onClick={() => setShowNotif(!showNotif)} className='cursor-pointer text-[#323232] hover:text-orange-500 transition-all relative p-1 rounded-full hover:bg-orange-50'>
                                    {notifications.some(n => !n.read) ?
                                        <MdNotificationsActive className='text-2xl text-orange-500 animate-swing' /> :
                                        <MdNotificationsNone className='text-2xl' />
                                    }
                                    {notifications.some(n => !n.read) && <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white'></span>}
                                </div>
                                {showNotif && (
                                    <div className='notification-dropdown animate-fadeIn'>
                                        <div className='notification-header flex justify-between items-center'>
                                            <span>Notifications</span>
                                            <span className="text-xs font-normal text-gray-400 cursor-pointer hover:text-orange-500" onClick={() => setShowNotif(false)}>Close</span>
                                        </div>
                                        <div className='notification-list scrollbar-hide'>
                                            {notifications.length === 0 ? (
                                                <div className='p-6 text-center text-gray-400 text-sm flex flex-col items-center gap-2'>
                                                    <MdNotificationsNone className='text-3xl opacity-50' />
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                notifications.map((notif, index) => (
                                                    <div key={index} onClick={() => { markRead(notif._id); setShowNotif(false); navigate('/myorders'); }} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-700">{notif.message}</p>
                                                            <span className='text-[10px] text-gray-400 mt-1 block'>{new Date(notif.date).toLocaleString()}</span>
                                                        </div>
                                                        {!notif.read && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {!token ? (
                            <button onClick={() => setShowLogin(true)} className='hidden sm:block bg-[#323232] text-white py-2.5 px-7 rounded-full text-sm font-bold hover:bg-orange-500 transition-all duration-300 shadow-lg hover:shadow-orange-200 active:scale-95'>
                                Sign In
                            </button>
                        ) : (
                            <div className='relative group'>
                                <div className='w-10 h-10 bg-orange-100/50 rounded-full flex items-center justify-center cursor-pointer border-2 border-orange-200 group-hover:bg-orange-200 transition-all duration-300'>
                                    <FiUser className='text-xl text-orange-600' />
                                </div>
                                {/* Dropdown Container with bridge padding */}
                                <div className='absolute hidden group-hover:block right-0 pt-4 z-[100]'>
                                    <ul className='flex flex-col gap-1 bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 w-52 animate-fadeIn origin-top-right'>
                                        <li onClick={() => navigate('/myorders')} className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 rounded-xl transition-all text-gray-700 font-bold text-sm'>
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><MdOutlineHistory /></div>
                                            <span>Orders</span>
                                        </li>
                                        <li onClick={() => navigate('/wishlist')} className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 rounded-xl transition-all text-gray-700 font-bold text-sm'>
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><FiHeart /></div>
                                            <span>Wishlist</span>
                                        </li>
                                        <hr className='my-2 border-gray-100' />
                                        <li onClick={logout} className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 rounded-xl transition-all text-red-600 font-bold text-sm'>
                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500"><FiLogOut /></div>
                                            <span>Logout</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Hamburger Icon */}
                        <div className='lg:hidden text-2xl cursor-pointer text-[#323232] hover:text-orange-500 transition-all ml-1 p-2 rounded-full hover:bg-gray-100' onClick={() => setIsMobileMenuOpen(true)}>
                            <FiMenu />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (Quick Access) */}
            <div className='sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#323232]/95 backdrop-blur-md px-8 py-3 rounded-full flex items-center justify-center gap-8 shadow-2xl border border-white/10 z-[100] animate-slideUp'>
                <div onClick={() => setVegOnly(!vegOnly)} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer active:scale-95 ${vegOnly ? 'border-green-500 bg-green-500 text-white' : 'border-gray-500 text-gray-400'}`}>
                    <span className='text-[10px] font-bold'>V</span>
                </div>

                <Link to='/cart' className='relative text-white text-2xl transition-transform active:scale-90 p-2'>
                    <FiShoppingBag />
                    {getTotalCartAmount() > 0 && <span className='absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[#323232]'></span>}
                </Link>

                {!token ? (
                    <div onClick={() => setShowLogin(true)} className='text-white text-2xl cursor-pointer active:scale-90 p-2'><FiUser /></div>
                ) : (
                    <div onClick={() => navigate('/myorders')} className='text-white text-2xl cursor-pointer active:scale-90 p-2'><MdOutlineHistory /></div>
                )}
            </div>

            {/* Slide-out Mobile Menu */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 ease-out py-8 px-6 flex flex-col gap-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
                    <div className='flex justify-between items-center w-full pb-6 border-b border-gray-100'>
                        <h2 className='text-3xl font-black text-orange-500 tracking-tighter'>LiteKitchen</h2>
                        <button onClick={() => setIsMobileMenuOpen(false)} className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800'>
                            <FiX className='text-2xl' />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <CiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400' />
                            <input
                                type="text"
                                placeholder="Search dishes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all'
                            />
                        </div>
                    </div>

                    <ul className='flex flex-col gap-4'>
                        <li onClick={() => { handleHomeClick(); }} className={`p-4 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-all ${menu === "home" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                            <span>Home</span>
                            {menu === "home" && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                        </li>
                        <li onClick={() => { handleNavClick("explore-menu", "menu"); window.location.href = '#explore-menu'; }} className={`p-4 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-all ${menu === "menu" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                            <span>Menu</span>
                            {menu === "menu" && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                        </li>
                        <li onClick={() => { handleNavClick("footer", "contact-us"); window.location.href = '#footer'; }} className={`p-4 rounded-xl font-bold flex items-center justify-between cursor-pointer transition-all ${menu === "contact-us" ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                            <span>Contact</span>
                            {menu === "contact-us" && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                        </li>
                    </ul>

                    {token && (
                        <div className="flex flex-col gap-3 mt-auto">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Account</h3>
                            <div onClick={() => { navigate('/myorders'); setIsMobileMenuOpen(false); }} className='flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 cursor-pointer text-gray-700 font-bold transition-all'>
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><MdOutlineHistory /></div>
                                Orders
                            </div>
                            <div onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }} className='flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 cursor-pointer text-gray-700 font-bold transition-all'>
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><FiHeart /></div>
                                Wishlist
                            </div>
                            <button onClick={logout} className='flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 cursor-pointer text-red-500 font-bold transition-all mt-2'>
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><FiLogOut /></div>
                                Logout
                            </button>
                        </div>
                    )}

                    {!token && (
                        <div className="mt-auto">
                            <button onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }} className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-200 active:scale-95 transition-all'>
                                Sign In / Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;

