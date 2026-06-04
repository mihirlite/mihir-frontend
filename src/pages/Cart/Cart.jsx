import React, { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdRemove, MdClose, MdCheckCircle, MdArrowForward, MdDeleteOutline, MdLocalOffer, MdCalendarToday, MdRestaurantMenu } from 'react-icons/md';
import { toast } from 'react-toastify';

const Cart = () => {

    const {
        cartItems, food_list, removeFromCart, addToCart, removeFromCartAll,
        url, applyCoupon, getDiscountAmount,
        appliedCoupon, setAppliedCoupon, getDeliveryFee, deliverySettings,
        getGSTAmount, getChargesAmount, getMealSlotStatus, subscriptionPrices, token, isWithinSchedule, generalSettings,
        setShowLogin,
        globalPlanConfig, setGlobalPlanConfig, isThali, getCanonicalName, getCalculatedPrice, getTotalCartAmountDynamic, getImageUrl
    } = useContext(StoreContext);


    const [couponInput, setCouponInput] = useState("");
    const navigate = useNavigate();

    // Helper to get default meal time based on schedule
    const getDefaultMealTime = () => {
        const lunch = getMealSlotStatus('Lunch');
        const dinner = getMealSlotStatus('Dinner');

        if (lunch.status === 'active' || lunch.status === 'upcoming') return 'Lunch';
        if (dinner.status === 'active' || dinner.status === 'upcoming') return 'Dinner';
        return 'Lunch'; // Fallback
    };

    // Initialize configs if needed
    useEffect(() => {
        if (!globalPlanConfig.mealTime) {
            setGlobalPlanConfig(prev => ({ ...prev, mealTime: getDefaultMealTime() }));
        }
    }, [generalSettings]);

    const handleConfigChange = (key, value) => {
        setGlobalPlanConfig(prev => {
            const newConfig = { ...prev, [key]: value };

            // Logic rules
            if (key === 'orderType' && value === 'today' && newConfig.mealTime === 'Both') {
                newConfig.mealTime = 'Lunch'; // 'Both' not allowed for Today Order
            }

            localStorage.setItem('globalPlanConfig', JSON.stringify(newConfig));
            return newConfig;
        });
    };

    const hasItems = Object.values(cartItems).some(count => count > 0);
    const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);
    const hasSubscription = globalPlanConfig.orderType !== 'today';

    const subtotal = getTotalCartAmountDynamic();
    const discount = getDiscountAmount(); // Assumes getDiscountAmount scales off subtotal or is fixed
    
    const hasDistanceSlabs = deliverySettings.locations && deliverySettings.locations.length > 0 && deliverySettings.distanceSlabs && deliverySettings.distanceSlabs.length > 0;
    let deliveryValue = 0;
    let deliveryLabel = "Calculated at checkout";
    
    if (deliverySettings.isFreeDelivery) {
        deliveryValue = 0;
        deliveryLabel = "Free";
    } else if (!hasDistanceSlabs) {
        deliveryValue = getDeliveryFee(subtotal);
        deliveryLabel = `₹${deliveryValue.toFixed(2)}`;
    }

    const gst = getGSTAmount(subtotal);
    const serviceCharges = getChargesAmount(subtotal);
    
    // Ensure 100% discount covers EVERYTHING (delivery, tax, etc.)
    const isFullDiscount = appliedCoupon && appliedCoupon.type === 'percentage' && appliedCoupon.value === 100;
    const finalDiscount = isFullDiscount ? (subtotal + deliveryValue + gst + serviceCharges) : discount;
    const total = isFullDiscount ? 0 : (subtotal + deliveryValue + gst + serviceCharges - discount);

    const proceedToCheckout = () => {
        // Redirect to login if not authenticated
        if (!token) {
            setShowLogin(true);
            return;
        }

        // Check if cart has at least one non-addon (main) item
        const hasMainItem = Object.keys(cartItems).some(itemId => {
            if (!cartItems[itemId] || cartItems[itemId] <= 0) return false;
            const itemInfo = food_list.find(f => f._id === itemId);
            return itemInfo && !itemInfo.isComboAddon;
        });

        if (!hasMainItem) {
            toast.warning("Please add a main item to your cart before checking out. Extras cannot be ordered alone.", {
                position: "bottom-center",
                autoClose: 4000,
                theme: "light",
            });
            return;
        }

        // Check if any "today" order is expired
        if (globalPlanConfig.orderType === 'today') {
            const slot = getMealSlotStatus(globalPlanConfig.mealTime);
            if (slot.status !== 'active') {
                toast.error(`The ${globalPlanConfig.mealTime} slot is ${slot.status}. ${slot.message}`, {
                    position: "bottom-center",
                    autoClose: 5000,
                });
                return;
            }
        }

        navigate('/order');
    }

    return (
        <div className='max-w-[800px] mx-auto pt-24 pb-12 px-4 md:px-6 animate-fadeIn'>
            <div className='bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-50'>
                    <h1 className='text-xl md:text-2xl font-black text-gray-800 tracking-tight'>
                        Your Cart <span className='text-gray-400 font-bold ml-1'>({totalItems} Items)</span>
                    </h1>
                    <button onClick={() => navigate('/')} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                        <MdClose className='text-2xl text-gray-400' />
                    </button>
                </div>

                {!hasItems ? (
                    <div className='py-24 flex flex-col items-center justify-center text-center px-6'>
                        <div className='text-8xl mb-8 opacity-20'>🛒</div>
                        <h2 className='text-2xl font-black text-gray-800 mb-2'>Your cart is empty</h2>
                        <p className='text-gray-500 mb-8 max-w-xs font-medium'>Satisfy your cravings! Browse our delicious menu and start adding food.</p>
                        <button
                            onClick={() => {
                                navigate('/');
                                setTimeout(() => {
                                    document.getElementById('all-foods')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            }}
                            className='w-full max-w-[280px] py-4 bg-[#ff7e00] text-white rounded-2xl font-black shadow-lg shadow-orange-100 active:scale-95 transition-all'
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className='p-4 md:p-8 space-y-8'>
                        {/* Items List */}
                        <div className='space-y-6'>
                            {(() => {
                                // Filter items based on mode
                                const displayItems = [];
                                let thaliInCart = false;
                                
                                food_list.forEach(item => {
                                    if (cartItems[item._id] > 0) {
                                        if (isThali(item)) {
                                            thaliInCart = true;
                                            if (globalPlanConfig.orderType === 'today') {
                                                displayItems.push(item);
                                            }
                                        } else if (!item.isComboAddon) {
                                            displayItems.push(item);
                                        }
                                    }
                                });

                                // If in subscription mode, add the "Subscription Thali" placeholder
                                if (globalPlanConfig.orderType !== 'today') {
                                    // Construct a virtual item for the subscription
                                    const subscriptionItem = {
                                        _id: 'subscription_thali',
                                        name: 'Subscription Thali',
                                        isSubscriptionThali: true,
                                        image: food_list.find(isThali)?.image || 'https://via.placeholder.com/150', // use first thali image
                                    };
                                    displayItems.unshift(subscriptionItem);
                                }

                                return displayItems.map((item, index) => {
                                    return (
                                        <div key={item._id} className='flex gap-4 items-start relative pb-6 border-b border-gray-50 last:border-0 last:pb-0'>
                                            {/* Item Image */}
                                            <div className='relative shrink-0'>
                                                <div className='w-24 h-24 md:w-28 md:h-28 rounded-[24px] overflow-hidden border border-gray-100'>
                                                    <img
                                                        className='w-full h-full object-cover'
                                                        src={getImageUrl(item.image)}
                                                        alt={item.name}
                                                    />
                                                </div>
                                            </div>

                                            {/* Item Details */}
                                            <div className='flex-1 flex flex-col pt-1'>
                                                <div className='flex justify-between items-start'>
                                                    <h3 className='font-black text-gray-800 text-lg md:text-xl leading-tight'>{item.name}</h3>
                                                    {!item.isSubscriptionThali && (
                                                        <button onClick={() => removeFromCartAll(item._id)} className='text-red-300 hover:text-red-500 transition-colors'>
                                                            <MdDeleteOutline size={26} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className='flex items-baseline gap-2 mt-1'>
                                                    {(() => {
                                                        const qty = cartItems[item._id] || 1;
                                                        
                                                        // Handle Subscription Thali
                                                        if (item.isSubscriptionThali) {
                                                            const matchingRule = (subscriptionPrices || []).find(
                                                                rule => rule.plan === globalPlanConfig.orderType &&
                                                                    rule.mealTiming === globalPlanConfig.mealTime &&
                                                                    rule.mealPreference === globalPlanConfig.mealType
                                                            );
                                                            if (matchingRule) {
                                                                const finalPrice = matchingRule.price;
                                                                if (matchingRule.discount > 0) {
                                                                    const originalPrice = Math.floor(finalPrice / (1 - matchingRule.discount / 100));
                                                                    return (
                                                                        <>
                                                                            <span className='text-lg font-black text-orange-600'>₹{finalPrice}</span>
                                                                            <span className='text-sm text-gray-400 line-through font-bold'>₹{originalPrice}</span>
                                                                            <span className='text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-black animate-pulse'>
                                                                                {matchingRule.discount}% OFF
                                                                            </span>
                                                                        </>
                                                                    );
                                                                }
                                                                return <span className='text-lg font-black text-orange-500'>₹{finalPrice}</span>;
                                                            }
                                                        }

                                                        // Handle Regular Product
                                                        const finalPrice = getCalculatedPrice(item);
                                                        if (item.discount > 0) {
                                                            const originalPrice = item.price * qty;
                                                            return (
                                                                <>
                                                                    <span className='text-lg font-black text-orange-600'>₹{finalPrice}</span>
                                                                    <span className='text-sm text-gray-400 line-through font-bold'>₹{originalPrice}</span>
                                                                    <span className='text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black'>
                                                                        {item.discount}% OFF
                                                                    </span>
                                                                </>
                                                            );
                                                        }

                                                        return <span className='text-lg font-black text-orange-500'>₹{finalPrice}</span>;
                                                    })()}
                                                </div>

                                                {!item.isSubscriptionThali && (
                                                    <div className='flex items-center gap-4 bg-gray-50/80 rounded-2xl p-1 border border-gray-100 shadow-inner w-fit mt-4'>
                                                        <button
                                                            onClick={() => removeFromCart(item._id)}
                                                            className='w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#ff7e00] transition-colors'
                                                        >
                                                            <MdRemove size={20} />
                                                        </button>
                                                        <span className='w-10 text-center font-black text-gray-800 text-lg'>{cartItems[item._id]}</span>
                                                        <button
                                                            onClick={() => addToCart(item._id)}
                                                            className='w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#ff7e00] transition-colors'
                                                        >
                                                            <MdAdd size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>

                        {!hasSubscription && food_list.some(item => 
                            item.isComboAddon && cartItems[item.parentId] > 0
                            && (!cartItems[item._id] || cartItems[item._id] === 0)
                        ) && (
                            <div className='py-8 border-t border-b border-gray-50/80 bg-orange-50/20 -mx-4 md:-mx-8 px-4 md:px-8'>
                                <div className='flex items-center justify-between mb-6'>
                                    <h3 className='text-lg font-black text-gray-800 tracking-tight flex items-center gap-3'>
                                        <div className='w-2 h-8 bg-gradient-to-b from-[#ff7e00] to-orange-400 rounded-full shadow-lg shadow-orange-100'></div>
                                        Don't forget these extras!
                                    </h3>
                                    <span className='text-[10px] bg-orange-500 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-[0.1em] shadow-lg shadow-orange-100 animate-pulse'>
                                        Selected for you
                                    </span>
                                </div>
                                <div className='flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory'>
                                    {food_list
                                        .filter(item => 
                                            item.isComboAddon && cartItems[item.parentId] > 0
                                            && (!cartItems[item._id] || cartItems[item._id] === 0)
                                        )
                                        .map((item, idx) => (
                                            <div key={idx} className='min-w-[170px] md:min-w-[190px] bg-white rounded-[2rem] border border-gray-100 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group snap-center relative overflow-hidden'>
                                                <div className='absolute top-0 right-0 w-16 h-16 bg-orange-50/50 rounded-full -mr-8 -mt-8'></div>
                                                <div className='relative h-28 md:h-32 rounded-2xl overflow-hidden mb-4 shadow-inner bg-gray-50'>
                                                    <img 
                                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' 
                                                        src={getImageUrl(item.image)} 
                                                        alt={item.name} 
                                                    />
                                                    {item.discount > 0 && (
                                                        <div className='absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-[9px] font-black text-white px-2.5 py-1 rounded-full shadow-lg'>
                                                            {item.discount}% OFF
                                                        </div>
                                                    )}
                                                </div>
                                                <h4 className='font-black text-gray-800 text-sm mb-2 truncate group-hover:text-[#ff7e00] transition-colors'>{item.name}</h4>
                                                <div className='flex items-center justify-between mt-3'>
                                                    <div className='flex flex-col'>
                                                        <span className='text-[10px] text-gray-400 font-bold uppercase'>Price</span>
                                                        <span className='font-black text-gray-900 text-base leading-none'>₹{item.price}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => addToCart(item._id)}
                                                        className={`
                                                            px-4 py-2 rounded-2xl text-[11px] font-black transition-all duration-300 shadow-md flex items-center gap-1
                                                            ${cartItems[item._id] > 0 
                                                                ? 'bg-gradient-to-r from-[#ff7e00] to-orange-500 text-white shadow-orange-200' 
                                                                : 'bg-white text-[#ff7e00] border-2 border-orange-50 hover:bg-orange-50 hover:border-orange-100'}
                                                        `}
                                                    >
                                                        {cartItems[item._id] > 0 ? (
                                                            <>
                                                                <MdCheckCircle size={14} />
                                                                {cartItems[item._id]}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdAdd size={14} />
                                                                ADD
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {/* Global Plan Settings (always displayed) */}
                        {(() => {
                            return (
                                <div className='p-6 md:p-8 bg-orange-50/60 rounded-[2rem] border border-orange-100/60 space-y-6 shadow-sm overflow-hidden relative'>
                                    <div className='absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16'></div>
                                    <h3 className='font-black text-gray-800 text-xl flex items-center gap-3 mb-6 relative z-10'>
                                        <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner'>
                                            <MdRestaurantMenu size={20} />
                                        </div>
                                        Plan Settings
                                    </h3>

                                    <div className='space-y-6 relative z-10'>
                                        {/* Order Type Tabs */}
                                        <div>
                                            <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdCalendarToday /> Order Plan</p>
                                            <div className='flex flex-wrap gap-3'>
                                                {['today', '15_days', '30_days'].map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => handleConfigChange('orderType', type)}
                                                        className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex-1 text-center min-w-[120px] ${globalPlanConfig.orderType === type ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 scale-105' : 'bg-white text-gray-500 border-2 border-transparent hover:border-orange-200'}`}
                                                    >
                                                        {type === 'today' ? "Today's Order" : type === '15_days' ? '15 Days Sub' : '30 Days Sub'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Meal Timing (Always displayed) */}
                                        <div>
                                            <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdCheckCircle /> Meal Timing</p>
                                            <div className='flex flex-wrap gap-3'>
                                                {['Lunch', 'Dinner'].concat(globalPlanConfig.orderType !== 'today' ? ['Both'] : []).map(time => {
                                                    const slot = getMealSlotStatus(time);
                                                    const isToday = globalPlanConfig.orderType === 'today';
                                                    const isDisabled = isToday && (slot.status === 'expired' || slot.status === 'upcoming');
                                                    
                                                    return (
                                                        <div key={time} className="flex-1 min-w-[120px] group relative">
                                                            <button
                                                                onClick={() => {
                                                                    if (isDisabled) {
                                                                        toast.info(slot.message, { position: 'bottom-center' });
                                                                        return;
                                                                    }
                                                                    handleConfigChange('mealTime', time);
                                                                }}
                                                                className={`w-full px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all text-center 
                                                                    ${globalPlanConfig.mealTime === time 
                                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-105' 
                                                                        : 'bg-white text-gray-500 border-2 border-transparent hover:border-green-200'}
                                                                    ${isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                                                                `}
                                                            >
                                                                {time === 'Lunch' ? '🌞 Lunch' : time === 'Dinner' ? '🌙 Dinner' : '✨ Both'}
                                                            </button>
                                                            
                                                            {isToday && (
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-gray-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                                                    <p className="font-bold">{slot.message}</p>
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Meal Type / Preference (Displayed for Subscriptions Only) */}
                                        {globalPlanConfig.orderType !== 'today' && (
                                            <div>
                                                <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2'><MdRestaurantMenu /> Meal Preference</p>
                                                <div className='flex flex-wrap gap-3'>
                                                    {['Veg', 'Non-Veg', 'Both'].map(mealType => (
                                                        <button
                                                            key={mealType}
                                                            onClick={() => handleConfigChange('mealType', mealType)}
                                                            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex-1 text-center min-w-[100px] ${globalPlanConfig.mealType === mealType ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-gray-500 border-2 border-transparent hover:border-blue-200'}`}
                                                        >
                                                            {mealType === 'Both' ? 'Both (Mix)' : mealType}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Dynamic Admin Message */}
                                        {(() => {
                                            const matchingRule = (subscriptionPrices || []).find(
                                                rule => rule.plan === globalPlanConfig.orderType &&
                                                    rule.mealTiming === globalPlanConfig.mealTime &&
                                                    rule.mealPreference === globalPlanConfig.mealType
                                            );
                                            if (matchingRule && matchingRule.message) {
                                                return (
                                                    <p className='text-sm text-blue-700 font-black mt-4 bg-blue-100/80 p-4 rounded-2xl inline-flex items-center gap-2 w-full'>
                                                        <MdCheckCircle size={18} /> {matchingRule.message}
                                                    </p>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Summary Section */}
                        <div className='space-y-4 pt-4 border-t border-gray-100 mt-6'>
                            <div className='flex justify-between items-center text-gray-600 font-bold'>
                                <p className='text-lg'>Subtotal</p>
                                <p className='text-gray-800 text-xl font-black'>₹{subtotal.toFixed(2)}</p>
                            </div>
                            <div className='flex justify-between items-center text-gray-400 font-bold'>
                                <p className='text-lg'>Delivery</p>
                                <p className={`${deliveryLabel === 'Calculated at checkout' ? 'text-sm text-orange-500' : 'text-lg text-gray-800'} font-black`}>{deliveryLabel}</p>
                            </div>
                            <div className='flex justify-between items-center text-gray-400 font-bold'>
                                <p className='text-lg'>GST and Charges</p>
                                <p className='text-gray-800 text-lg font-black'>₹{(gst + serviceCharges).toFixed(2)}</p>
                            </div>

                            {finalDiscount > 0 && (
                                <div className='flex justify-between items-center text-green-600 font-bold animate-fadeIn'>
                                    <p className='text-lg flex items-center gap-2'>
                                        <MdLocalOffer /> Discount ({appliedCoupon?.name})
                                    </p>
                                    <p className='text-green-600 text-lg font-black'>-₹{finalDiscount.toFixed(2)}</p>
                                </div>
                            )}

                            <div className='pt-6 flex justify-between items-center'>
                                <h3 className='text-2xl font-black text-gray-800 tracking-tight'>Total</h3>
                                <p className='text-3xl font-black text-gray-800'>₹{total.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Free Delivery Promo */}
                        <div className='flex items-center gap-3 py-2'>
                            <MdCheckCircle className='text-green-500 text-2xl' />
                            <p className='text-green-700 font-black text-sm md:text-base'>
                                {deliverySettings.isFreeDelivery 
                                    ? 'Free Delivery!' 
                                    : (hasDistanceSlabs 
                                        ? 'Delivery fee calculated at checkout based on location' 
                                        : (deliveryValue === 0 
                                            ? 'Free Delivery unlocked!' 
                                            : `Delivery Charge: ₹${deliveryValue}`))}
                            </p>
                        </div>

                        {/* After Hours Notice */}
                        {!isWithinSchedule && (
                            <div className='mt-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3 animate-fadeIn'>
                                <span className='text-orange-500 text-xl mt-0.5'>⏰</span>
                                <div>
                                    <p className='font-black text-orange-700 text-sm'>Order time is currently closed</p>
                                    <p className='text-orange-600 text-xs font-medium mt-0.5'>
                                        Your order will be processed starting from <span className='font-black'>{generalSettings?.onlineFrom || "opening time"}</span>. You can still place your order now!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Checkout Button */}
                        <button
                            onClick={proceedToCheckout}
                            className='w-full mt-6 bg-[#ff7e00] text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center justify-center gap-2'
                        >
                            Proceed to Checkout <MdArrowForward size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart
