import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { HiOutlineSearch, HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiMenu, FiX, FiPackage } from "react-icons/fi";
import logo from '../../assets/logo/logo.png';
import './NotificationPanel.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
    const [menu, setMenu] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { getTotalCartAmount, cartItems, token, setToken, setShowLogin, setVegOnly, setNonVegOnly } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value && window.location.pathname !== '/') {
            navigate('/');
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const element = document.getElementById('all-foods');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery("");
        }
    }

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
        // Clear veg/non-veg filters so all items show when navigating to menu
        if (menuName === 'menu') {
            setVegOnly(false);
            setNonVegOnly(false);
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
        <div className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
            <nav className='flex justify-between items-center w-full px-4 sm:px-6 md:px-8 lg:w-[85%] xl:w-[80%] m-auto py-0'>
                {/* Logo Section */}
                <div onClick={handleHomeClick} className='flex items-center cursor-pointer'>
                    <img src={logo} alt="FlavoHub" className='h-20 sm:h-24 lg:h-28 w-auto object-contain transition-all duration-300' />
                </div>

                {/* Desktop Navigation */}
                <div className='hidden lg:flex items-center gap-10 xl:gap-14'>
                    <ul className='flex list-none gap-8 xl:gap-11 text-[#494949] font-bold text-[16px] xl:text-[17px]'>
                        <li onClick={handleHomeClick} className={`cursor-pointer transition-colors ${menu === "home" ? "text-[#ff7e00]" : "hover:text-[#ff7e00]"}`}>
                            Home
                        </li>
                        <li onClick={() => handleNavClick("all-foods", "menu")} className={`cursor-pointer transition-colors ${menu === "menu" ? "text-[#ff7e00]" : "hover:text-[#ff7e00]"}`}>
                            Menu
                        </li>
                        <li onClick={() => handleNavClick("footer", "contact-us")} className={`cursor-pointer transition-colors ${menu === "contact-us" ? "text-[#ff7e00]" : "hover:text-[#ff7e00]"}`}>
                            Contact
                        </li>
                    </ul>

                    {/* Desktop Icons & Auth */}
                    <div className='flex items-center gap-6'>
                        {/* Search Bar Implementation */}
                        <div className={`flex items-center gap-2 group transition-all duration-300 ${isSearchOpen ? 'bg-gray-50 px-4 py-2 rounded-full border border-orange-100 shadow-inner' : ''}`}>
                            {isSearchOpen && (
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search food..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent outline-none text-[#323232] font-semibold w-32 xl:w-48 placeholder-gray-400 text-sm animate-fadeIn"
                                />
                            )}
                            <div
                                onClick={toggleSearch}
                                className={`cursor-pointer transition-all duration-300 ${isSearchOpen ? 'text-[#ff7e00]' : 'text-[#323232] hover:text-[#ff7e00]'}`}
                            >
                                {isSearchOpen ? <FiX className='text-[22px]' /> : <HiOutlineSearch className='text-[26px] xl:text-[28px]' />}
                            </div>
                        </div>

                        <Link to='/cart' className='relative cursor-pointer text-[#323232] hover:text-[#ff7e00] transition-transform active:scale-95'>
                            <HiOutlineShoppingBag className='text-[26px] xl:text-[28px]' />
                            {getTotalCartAmount() > 0 && (
                                <span className='absolute -top-1.5 -right-1.5 bg-[#ff7e00] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold'>
                                    {Object.keys(cartItems).filter(id => cartItems[id] > 0).length}
                                </span>
                            )}
                        </Link>

                        {!token ? (
                            <button
                                onClick={() => setShowLogin(true)}
                                className='bg-[#323232] text-white py-2.5 px-8 rounded-full font-bold text-sm hover:bg-[#ff7e00] transition-all active:scale-95 shadow-lg selection:bg-none'
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className='relative'>
                                <div
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className='cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all text-[#323232] active:scale-95'
                                >
                                    <HiOutlineUser className='text-[28px]' />
                                </div>
                                {showProfileDropdown && (
                                    <ul className='absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-fadeIn flex flex-col'>
                                        <li
                                            onClick={() => { navigate('/myorders'); setShowProfileDropdown(false); }}
                                            className='flex items-center gap-3 px-5 py-3 hover:bg-orange-50 cursor-pointer text-gray-700 font-bold transition-colors'
                                        >
                                            <FiPackage className='text-orange-500' size={18} /> Orders
                                        </li>
                                        <hr className='border-gray-50' />
                                        <li
                                            onClick={() => { logout(); setShowProfileDropdown(false); }}
                                            className='flex items-center gap-3 px-5 py-3 hover:bg-red-50 cursor-pointer text-gray-700 font-bold transition-colors'
                                        >
                                            <HiOutlineLogout className='text-red-500' size={18} /> Logout
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Icon */}
                <div className='lg:hidden flex items-center gap-3 sm:gap-4'>
                    <Link to='/cart' className='relative'>
                        <HiOutlineShoppingBag className='text-2xl sm:text-3xl text-[#323232]' />
                        {getTotalCartAmount() > 0 && <span className='absolute -top-1 -right-1 w-2 h-2 bg-[#ff7e00] rounded-full'></span>}
                    </Link>
                    <div
                        className='p-2 rounded-xl bg-gray-100 hover:bg-orange-50 active:bg-orange-100 cursor-pointer text-[#323232] transition-colors duration-200'
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <FiMenu className='text-2xl sm:text-3xl' />
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-[2000] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-0 h-screen w-[85%] max-w-[350px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Sidebar Header */}
                    <div className='flex justify-between items-center px-6 py-6 border-b border-gray-50'>
                        <img src={logo} alt="FlavoHub" className='h-12 w-auto object-contain' />
                        <div
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-orange-500 transition-colors'
                        >
                            <FiX size={24} />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <ul className='flex flex-col p-6 gap-2'>
                        {[
                            { name: "Home", id: "home", action: handleHomeClick },
                            { name: "Menu", id: "all-foods", menuName: "menu" },
                            { name: "Contact", id: "footer", menuName: "contact-us" }
                        ].map((item) => (
                            <li
                                key={item.name}
                                onClick={() => {
                                    if (item.action) item.action();
                                    else handleNavClick(item.id, item.menuName);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`px-4 py-4 rounded-2xl text-lg font-bold transition-all active:bg-orange-50 ${menu === (item.menuName || item.id) ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>

                    {/* Auth Section */}
                    <div className='mt-auto p-6 border-t border-gray-50 bg-gray-50/30'>
                        {!token ? (
                            <button
                                onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }}
                                className='w-full bg-[#323232] text-white py-4.5 rounded-2xl font-black text-lg shadow-xl shadow-gray-200 active:scale-95 transition-all'
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className='flex flex-col gap-3'>
                                <button
                                    onClick={() => { navigate('/myorders'); setIsMobileMenuOpen(false); }}
                                    className='w-full bg-white text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-gray-100 shadow-sm active:scale-95 transition-all'
                                >
                                    <FiPackage className='text-orange-500' size={20} /> My Orders
                                </button>
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className='w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-100/50'
                                >
                                    <HiOutlineLogout size={20} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

