import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const FloatingCart = () => {
    const { cartItems, getTotalCartAmount, food_list } = useContext(StoreContext);
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
        <div className="fixed bottom-0 left-0 right-0 z-[800] p-4 pointer-events-none animate-fadeIn">
            <div className="max-w-[1280px] mx-auto flex justify-center">
                <div 
                    onClick={() => navigate('/cart')}
                    className="pointer-events-auto w-full sm:w-auto min-w-[300px] bg-orange-600 text-white rounded-2xl shadow-[0_10px_40px_rgba(255,107,0,0.3)] flex items-center justify-between p-4 cursor-pointer hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-orange-100">
                            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                        </span>
                        <span className="font-black text-xl tracking-tight">
                            ₹{totalAmount}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lg bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                        View Cart <FiArrowRight className="mt-0.5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatingCart;
