import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const FoodItemSheet = ({ isOpen, onClose, food }) => {
    const { cartItems, addToCart, removeFromCart, getImageUrl, token, setShowLogin } = useContext(StoreContext);
    const navigate = useNavigate();
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsAnimatingOut(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            onClose();
        }, 300); // match transition duration
    };

    if (!isOpen && !isAnimatingOut) return null;
    if (!food) return null;

    const discount = food.discount || 0;
    const discountedPrice = discount > 0 ? Math.floor(food.price - (food.price * discount / 100)) : food.price;
    const imagesArray = Array.isArray(food.image) ? food.image : [food.image];
    
    // Mock includes for demo purposes if not available in DB
    const includes = food.includes || ['Rice', 'Chicken Curry', 'Dal', 'Salad', 'Papad'];

    const handleAddToCart = () => {
        if (!token) {
            handleClose();
            setShowLogin(true);
            return;
        }
        addToCart(food._id);
    };

    const handleBuyNow = () => {
        if (!token) {
            handleClose();
            setShowLogin(true);
            return;
        }
        if (!cartItems[food._id]) {
            addToCart(food._id);
        }
        handleClose();
        navigate('/cart');
    };

    return (
        <div className={`fixed inset-0 z-[3000] flex items-end sm:items-center justify-center transition-opacity duration-300 ${!isOpen || isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
            
            <div className={`relative w-full sm:w-[500px] h-[90vh] sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-3xl rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isOpen || isAnimatingOut ? 'translate-y-full sm:translate-y-10 sm:scale-95' : 'translate-y-0 sm:scale-100'}`}>
                
                {/* Hero Image */}
                <div className="relative h-[250px] sm:h-[300px] w-full bg-gray-100 shrink-0">
                    <img 
                        src={getImageUrl(imagesArray[0])} 
                        alt={food.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent"></div>
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    <div>
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight">
                                {food.name}
                            </h2>
                            <div className={`flex-shrink-0 w-5 h-5 border-2 p-[2px] flex justify-center items-center mt-1.5 ${food.veg ? "border-green-600" : "border-red-600"}`}>
                                <div className={`w-full h-full rounded-full ${food.veg ? "bg-green-600" : "bg-red-600"}`}></div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-white bg-green-600 px-2 py-0.5 rounded text-xs font-bold gap-1">
                                <span>⭐</span> 4.5
                            </div>
                            <span className="text-sm text-gray-400 font-medium">(124 Reviews)</span>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-orange-600">₹{discountedPrice}</span>
                        {discount > 0 && (
                            <>
                                <span className="text-lg text-gray-400 font-bold line-through">₹{food.price}</span>
                                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                    {discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    <div className="w-full h-[1px] bg-gray-100"></div>

                    {/* Description */}
                    <div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {food.description || "Traditional style meal served with all the classic accompaniments to give you the perfect taste."}
                        </p>
                    </div>

                    {/* Includes */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">What's Included</h3>
                        <div className="flex flex-wrap gap-2">
                            {includes.map((item, idx) => (
                                <span key={idx} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between gap-4">
                        {/* Quantity Selector */}
                        {cartItems[food._id] > 0 ? (
                            <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                                <button 
                                    onClick={() => removeFromCart(food._id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-xl shadow-sm hover:text-red-500 transition-colors"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center font-black text-lg text-gray-800">
                                    {cartItems[food._id]}
                                </span>
                                <button 
                                    onClick={() => addToCart(food._id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 font-bold text-xl shadow-sm hover:text-green-500 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 py-3.5 bg-orange-50 text-orange-600 rounded-xl font-bold text-base border-2 border-orange-200 hover:bg-orange-100 transition-colors"
                            >
                                Add To Cart
                            </button>
                        )}

                        <button 
                            onClick={handleBuyNow}
                            className="flex-1 py-4 bg-orange-500 text-white rounded-xl font-bold text-base shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodItemSheet;
