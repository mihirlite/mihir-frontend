import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const FloatingCart = () => {
    const { cartItems, getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Do not show on cart, order, or checkout pages
    if (location.pathname.startsWith('/cart') || location.pathname.startsWith('/order')) {
        return null;
    }

    const totalAmount = getTotalCartAmount();
    
    if (totalAmount === 0) return null;

    const itemCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[800] p-4 pointer-events-none animate-slideUp">
            <div className="max-w-[1280px] mx-auto flex justify-center">
                <div 
                    onClick={() => navigate('/cart')}
                    className="pointer-events-auto w-full sm:w-auto min-w-[320px] bg-[#FF6B00] text-white rounded-xl shadow-[0_10px_40px_rgba(255,107,0,0.3)] flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#e66000] hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[16px] tracking-tight">
                            {itemCount} {itemCount === 1 ? 'Item' : 'Items'} | ₹{totalAmount}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-[16px]">
                        View Cart →
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatingCart;
