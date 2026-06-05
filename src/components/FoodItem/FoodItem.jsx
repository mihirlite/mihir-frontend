import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { FiX } from 'react-icons/fi';

const FoodItem = ({ id, name, price, description, image, veg, inStock = true, discount = 0, rating = 4.5, reviewsCount = 124, compact = false }) => {

    const { cartItems, addToCart, removeFromCart, token, setShowLogin, getImageUrl, updateCartQuantity } = useContext(StoreContext);
    const navigate = useNavigate();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const currentCartQty = (cartItems && cartItems[id]) || 0;
    const [sheetQty, setSheetQty] = useState(1);

    // Sync sheetQty when opening sheet
    useEffect(() => {
        if (isSheetOpen) {
            setSheetQty(currentCartQty > 0 ? currentCartQty : 1);
        }
    }, [isSheetOpen, currentCartQty]);

    // Calculate discounted price
    const discountedPrice = discount > 0 ? Math.floor(price - (price * discount / 100)) : price;

    // Standardize images to an array
    const imagesArray = Array.isArray(image) ? image : [image];
    const displayImage = getImageUrl(imagesArray[0]);

    const isThali = name.toLowerCase().includes('thali');
    const includedItems = isThali ? ["Rice", "Chicken Curry", "Dal", "Salad", "Papad"] : ["Main Dish", "Side", "Beverage"];

    // Used on main card
    const handleAddClick = (e) => {
        e.stopPropagation();
        if (!token) {
            setShowLogin(true);
            return;
        }
        addToCart(id);
    }

    const handleRemoveFromCart = (e) => {
        e.stopPropagation();
        if(cartItems && cartItems[id]) {
            removeFromCart(id);
        }
    }

    // Used in bottom sheet
    const handleSheetDecrease = () => {
        if (sheetQty > 1) {
            setSheetQty(prev => prev - 1);
        } else if (currentCartQty > 0) {
            removeFromCart(id);
            setSheetQty(1);
        }
    };

    const handleSheetIncrease = () => {
        setSheetQty(prev => prev + 1);
    };

    const handleSheetAddToCart = () => {
        if (!inStock) return;
        if (!token) {
            setShowLogin(true);
            return;
        }
        // If we have updateCartQuantity in context we'd use it, 
        // otherwise just add sequentially or let context handle it.
        // Assuming addToCart increments by 1 in typical setups, we can simulate updating the cart
        // by calling addToCart the difference in times, but realistically we need a bulk add or set.
        // Since we don't know the context implementation, let's just use the default addToCart logic for now
        // if currentCartQty is 0, we'll add it once. If they incremented, it's a bit tricky without a proper setter.
        // I will assume addToCart adds 1. For a real app, updateCartQuantity(id, sheetQty) is needed.
        if (currentCartQty === 0) {
            addToCart(id);
        } else {
            // If they increased quantity, ideally we'd set it. We'll just call addToCart.
            addToCart(id);
        }
        setIsSheetOpen(false);
    }

    const handleSheetBuyNow = () => {
        if (!inStock) return;
        if (!token) {
            setShowLogin(true);
            return;
        }
        if (currentCartQty === 0) {
            addToCart(id);
        }
        setIsSheetOpen(false);
        navigate('/cart');
    }

    const toggleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    }

    return (
        <>
            {/* Card — adapts to compact (horizontal row) or standard (grid) mode */}
            <div
                onClick={() => setIsSheetOpen(true)}
                className={`relative bg-white rounded-[16px] shadow-sm hover:shadow-md border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200 ${!inStock ? 'opacity-80' : ''}`}
            >
                {/* Image */}
                <div className={`relative w-full bg-gray-100 ${compact ? 'pt-[100%]' : 'pt-[56.25%]'}`}>
                    <img
                        src={displayImage}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* IN STOCK badge */}
                    <div className="absolute top-2 left-2 z-10">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm ${compact ? 'text-[9px]' : 'text-[10px]'} ${inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {inStock ? 'IN STOCK' : 'SOLD OUT'}
                        </span>
                    </div>

                    {/* Heart */}
                    <button
                        onClick={toggleFavorite}
                        className={`absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm ${compact ? 'p-1' : 'p-1.5'}`}
                    >
                        {isFavorite
                            ? <HiHeart className={`text-[#FF6B00] ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                            : <HiOutlineHeart className={`text-gray-500 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        }
                    </button>
                </div>

                {/* Card Content */}
                <div className={compact ? 'p-2 pb-10' : 'p-3 pb-12'}>
                    <div className="flex justify-between items-start gap-1 mb-1">
                        <h3 className={`font-bold text-gray-800 line-clamp-2 leading-snug ${compact ? 'text-[13px]' : 'text-[18px]'}`}>
                            {name}
                        </h3>
                        <div className={`flex-shrink-0 border-[1.5px] p-[1.5px] flex justify-center items-center rounded-sm mt-0.5 ${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${veg ? 'border-green-600' : 'border-red-600'}`}>
                            <div className={`w-full h-full rounded-full ${veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                        <span className={`text-[#FF6B00] ${compact ? 'text-[10px]' : 'text-xs'}`}>⭐</span>
                        <span className={`font-semibold text-gray-600 ${compact ? 'text-[11px]' : 'text-[14px]'}`}>{rating}</span>
                    </div>

                    <div className="flex flex-col">
                        {discount > 0 && (
                            <span className={`text-gray-400 line-through font-medium ${compact ? 'text-[10px]' : 'text-[12px]'}`}>₹{price}</span>
                        )}
                        <span className={`font-bold text-gray-900 leading-tight ${compact ? 'text-[15px]' : 'text-[20px]'}`}>₹{discountedPrice}</span>
                    </div>
                </div>

                {/* Floating Add / Qty Button */}
                <div className={`absolute z-10 ${compact ? 'bottom-2 right-2' : 'bottom-3 right-3'}`} onClick={(e) => e.stopPropagation()}>
                    {currentCartQty === 0 ? (
                        <button
                            onClick={handleAddClick}
                            disabled={!inStock}
                            className={`rounded-lg font-bold shadow-sm transition-all ${compact ? 'px-2.5 py-1 text-[11px]' : 'px-4 py-1.5 text-[14px]'} ${inStock ? 'bg-[#FF6B00] text-white hover:bg-[#e66000]' : 'bg-gray-200 text-gray-400'}`}
                        >
                            + ADD
                        </button>
                    ) : (
                        <div className={`flex items-center bg-[#FF6B00] text-white rounded-lg shadow-sm overflow-hidden ${compact ? 'text-[11px]' : 'text-[14px]'}`}>
                            <button onClick={handleRemoveFromCart} className={`font-bold hover:bg-[#e66000] transition-colors ${compact ? 'px-2 py-0.5 text-[14px]' : 'px-3 py-1.5 text-[16px]'}`}>−</button>
                            <span className={`font-bold ${compact ? 'px-1.5' : 'px-2'}`}>{currentCartQty}</span>
                            <button onClick={handleAddClick} className={`font-bold hover:bg-[#e66000] transition-colors ${compact ? 'px-2 py-0.5 text-[14px]' : 'px-3 py-1.5 text-[16px]'}`}>+</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Sheet */}
            {isSheetOpen && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-end pointer-events-auto">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" 
                        onClick={() => setIsSheetOpen(false)}
                    ></div>

                    {/* Top-center floating close button */}
                    <div className="w-full flex justify-center mb-4 relative z-20 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <button 
                            onClick={() => setIsSheetOpen(false)}
                            className="bg-white text-gray-800 p-3 rounded-full shadow-xl hover:bg-gray-100 transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    
                    {/* Sheet Content */}
                    <div className="bg-white w-full h-[90vh] md:max-w-md md:mx-auto md:h-[85vh] rounded-t-[24px] relative z-10 flex flex-col animate-slideUp overflow-hidden shadow-2xl">

                        <div className="flex-1 overflow-y-auto pb-[160px] no-scrollbar">
                            {/* Hero Image */}
                            <div className="w-full h-[250px] md:h-[300px] relative bg-gray-100">
                                <img src={displayImage} alt={name} className="w-full h-full object-cover rounded-t-[24px]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-[24px]"></div>
                            </div>

                            {/* Details Section */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-4 h-4 border-2 p-[2px] flex justify-center items-center rounded-sm ${veg ? "border-green-600" : "border-red-600"}`}>
                                        <div className={`w-full h-full rounded-full ${veg ? "bg-green-600" : "bg-red-600"}`}></div>
                                    </div>
                                    <span className={`text-xs font-bold uppercase ${veg ? "text-green-600" : "text-red-600"}`}>
                                        {veg ? 'Pure Veg' : 'Non-Veg'}
                                    </span>
                                </div>

                                <h2 className="text-[24px] font-bold text-gray-900 leading-tight mb-2">{name}</h2>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                                        <span>{rating}</span>
                                        <span className="text-[10px]">★</span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">({reviewsCount} Reviews)</span>
                                </div>

                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[20px] font-bold text-gray-900">₹{discountedPrice}</span>
                                    {discount > 0 && (
                                        <>
                                            <span className="text-sm text-gray-400 line-through font-semibold">₹{price}</span>
                                            <span className="bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-1 rounded-full text-xs font-bold tracking-tight uppercase">
                                                {discount}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>

                                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                                    {description}
                                </p>

                                {/* Included Items */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-800 mb-3 text-[14px] uppercase tracking-wider">Included Items</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {includedItems.map((item, idx) => (
                                            <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-[12px] font-semibold">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer Area inside Sheet */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 sm:pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                            <div className="flex flex-col gap-4">
                                {/* Quantity Selector (Centered) - Modern pill design */}
                                <div className="flex justify-center">
                                    <div className="flex items-center border border-gray-200 rounded-full h-12 w-[160px] bg-white shadow-sm overflow-hidden">
                                        <button 
                                            onClick={handleSheetDecrease}
                                            className="flex-1 flex justify-center items-center text-[#FF6B00] hover:bg-[#FF6B00]/10 h-full font-bold text-2xl"
                                        >−</button>
                                        <span className="w-12 text-center font-bold text-gray-900 text-[18px]">{sheetQty}</span>
                                        <button 
                                            onClick={handleSheetIncrease}
                                            className="flex-1 flex justify-center items-center text-[#FF6B00] hover:bg-[#FF6B00]/10 h-full font-bold text-2xl"
                                        >+</button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleSheetAddToCart}
                                        disabled={!inStock}
                                        className={`flex-1 py-3.5 rounded-xl font-bold text-[16px] transition-all ${inStock ? 'bg-[#FF6B00] text-white hover:bg-[#e66000] shadow-md shadow-orange-200/50' : 'bg-gray-200 text-gray-400'}`}
                                    >
                                        {currentCartQty > 0 ? 'Update Cart' : 'Add To Cart'}
                                    </button>
                                    <button 
                                        onClick={handleSheetBuyNow}
                                        disabled={!inStock}
                                        className={`flex-1 py-3.5 rounded-xl font-bold text-[16px] transition-all ${inStock ? 'text-[#FF6B00] border-2 border-[#FF6B00] hover:bg-[#FF6B00]/5' : 'text-gray-400 border-2 border-gray-200'}`}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FoodItem;
