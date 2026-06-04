import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdPayment, MdLocationOn, MdShoppingBag, MdArrowForward, MdConfirmationNumber, MdClose, MdCheckCircle } from 'react-icons/md';


const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url, getDiscountAmount, getDeliveryFee, getGSTAmount, getChargesAmount, subscriptionPrices, deliverySettings, isWithinSchedule, generalSettings, applyCoupon, appliedCoupon, setAppliedCoupon, globalPlanConfig, isThali, getCalculatedPrice, getTotalCartAmountDynamic } = useContext(StoreContext)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "" // We will initialize this in useEffect when deliverySettings load
    })
    const [couponInput, setCouponInput] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [showCouponsList, setShowCouponsList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const fetchAvailableCoupons = async () => {
        try {
            const response = await axios.get(url + "/api/coupon/list-active");
            if (response.data.success) {
                setAvailableCoupons(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    }

    useEffect(() => {
        fetchAvailableCoupons();
    }, []);

    useEffect(() => {
        if (deliverySettings?.locations?.length > 0 && !data.address) {
            setData(prev => ({ ...prev, address: deliverySettings.locations[0].name }));
        }
    }, [deliverySettings, data.address])

    const hasSubscription = globalPlanConfig.orderType !== 'today';


    const onChangeHandler = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        if (name === 'phone') {
            value = value.replace(/\D/g, '');
        }
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (event) => {
        event.preventDefault();
        setLoading(true);
        let orderItems = [];
        if (hasSubscription) {
            // Subscription Mode: Group all thalis into one virtual item
            const thaliItemsInCart = food_list.filter(item => cartItems[item._id] > 0 && isThali(item));
            if (thaliItemsInCart.length > 0) {
                const matchingRule = (subscriptionPrices || []).find(
                    rule => rule.plan === globalPlanConfig.orderType &&
                        rule.mealTiming === globalPlanConfig.mealTime &&
                        rule.mealPreference === globalPlanConfig.mealType
                );
                
                if (matchingRule) {
                    orderItems.push({
                        _id: 'subscription_thali',
                        name: 'Subscription Thali',
                        price: matchingRule.price,
                        quantity: 1,
                        subscription: globalPlanConfig,
                        image: thaliItemsInCart[0].image
                    });
                }
            }

            // Add non-thali items
            food_list.forEach(item => {
                if (cartItems[item._id] > 0 && !isThali(item) && !item.isComboAddon) {
                    let itemInfo = { ...item };
                    itemInfo["quantity"] = cartItems[item._id];
                    itemInfo["price"] = getCalculatedPrice(item) / cartItems[item._id];
                    orderItems.push(itemInfo);
                }
            });
        } else {
            // Normal Mode: Individual items
            food_list.forEach((item) => {
                if (cartItems[item._id] > 0) {
                    let itemInfo = { ...item };
                    itemInfo["quantity"] = cartItems[item._id];
                    itemInfo["price"] = getCalculatedPrice(item) / cartItems[item._id]; // store unit price

                    if (isThali(item)) {
                        itemInfo["subscription"] = globalPlanConfig;
                    }

                    orderItems.push(itemInfo);
                }
            });
        }
        let subtotal = getTotalCartAmountDynamic();
        let deliveryFee = getDeliveryFee(subtotal, data.address);
        let gstAmount = getGSTAmount(subtotal);
        let chargesAmount = getChargesAmount(subtotal);
        let discountAmount = getDiscountAmount();

        let finalAmount = subtotal + deliveryFee + gstAmount + chargesAmount - discountAmount;

        // If it's a 100% discount, ensure the final amount is zero (covers delivery and taxes)
        if (appliedCoupon && appliedCoupon.type === 'percentage' && appliedCoupon.value === 100) {
            finalAmount = 0;
        }

        let orderData = {
            address: data,
            items: orderItems,
            amount: finalAmount,
            paymentMethod: paymentMethod,
            couponCode: appliedCoupon ? appliedCoupon.name : ""
        }
        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                const { order, orderId } = response.data;

                if (paymentMethod === 'cod') {
                    setLoading(false);
                    setShowSuccessPopup(true);
                    return;
                }

                if (!window.Razorpay) {
                    alert("Razorpay SDK failed to load. Please check your connection.");
                    setLoading(false);
                    return;
                }

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                    amount: order.amount,
                    currency: order.currency,
                    name: "Flavohub",
                    description: "Food Delivery Payment",
                    order_id: order.id,
                    handler: async function (response) {
                        try {
                            const verifyResponse = await axios.post(url + "/api/order/verify", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderId
                            }, { headers: { token } });

                            if (verifyResponse.data.success) {
                                setShowSuccessPopup(true);
                            } else {
                                alert("Payment verification failed");
                            }
                        } catch (error) {
                            console.error(error);
                            alert("Error verifying payment");
                        } finally {
                            setLoading(false);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: `${data.firstName} ${data.lastName}`,
                        contact: data.phone
                    },
                    theme: {
                        color: "#EA580C"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }
            else {
                alert(response.data.message || "Error placing order");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Payment service error");
            setLoading(false);
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/cart')
        }
        else if (getTotalCartAmountDynamic() === 0) {
            navigate('/cart')
        }
    }, [token, cartItems, navigate])

    const hasAttemptedAutoApply = React.useRef(false);

    useEffect(() => {
        if (token && !appliedCoupon && !hasAttemptedAutoApply.current) {
            hasAttemptedAutoApply.current = true;
            const autoApply = async () => {
                await applyCoupon("FIRST50");
            }
            autoApply();
        }
    }, [token, appliedCoupon, applyCoupon]);

    useEffect(() => {
        if (hasSubscription && paymentMethod === 'cod') {
            setPaymentMethod('online');
        }
    }, [hasSubscription, paymentMethod]);

    return (
        <div className='max-w-[1280px] mx-auto px-4 pt-28 pb-20 animate-fadeIn'>
            <form onSubmit={placeOrder} className='flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20'>
                {/* Delivery Information Section */}
                <div className="w-full lg:flex-1 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <div className='flex items-center gap-3 mb-8'>
                        <div className='w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500'>
                            <MdLocationOn size={28} />
                        </div>
                        <div>
                            <h2 className='text-3xl font-black text-gray-800 tracking-tight'>Delivery Information</h2>
                            <p className='text-gray-500 text-sm font-medium'>Please provide your basic details</p>
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className='flex-1'>
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1'>First Name <span className='text-red-500'>*</span></p>
                                <input required name='firstName' onChange={onChangeHandler} value={data.firstName}
                                    className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                    type="text" placeholder='First name'
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1'>Last Name <span className='text-red-500'>*</span></p>
                                <input required name='lastName' onChange={onChangeHandler} value={data.lastName}
                                    className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                    type="text" placeholder='Last name'
                                />
                            </div>
                        </div>

                        <div>
                            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1'>Phone Number <span className='text-red-500'>*</span></p>
                            <input required name='phone' 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) {
                                        onChangeHandler({ target: { name: 'phone', value: val } });
                                    }
                                }} 
                                value={data.phone}
                                className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                type="tel" placeholder='10-digit phone number'
                                minLength={10} maxLength={10} pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                            />
                        </div>

                        <div>
                            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1'>Delivery Location <span className='text-red-500'>*</span></p>
                            <select
                                required
                                name='address'
                                onChange={onChangeHandler}
                                value={data.address}
                                className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm appearance-none'
                            >
                                <option value="" disabled>Select Delivery Area</option>
                                {deliverySettings?.locations?.length > 0 ? (
                                    deliverySettings.locations.map((loc, index) => (
                                        <option key={index} value={loc.name}>{loc.name} ({loc.distance} km)</option>
                                    ))
                                ) : (
                                    <option value="" disabled>No delivery areas configured</option>
                                )}
                            </select>
                        </div>

                        {/* Coupon Code Section */}
                        <div className='mt-8'>
                            <div 
                                className='flex items-center justify-between cursor-pointer group transition-all select-none hover:opacity-80 active:scale-[0.99] mb-4'
                                onClick={() => {
                                    if (appliedCoupon) return;
                                    setShowCouponsList(!showCouponsList);
                                    if (availableCoupons.length === 0) fetchAvailableCoupons();
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <div className={`p-1.5 rounded-lg transition-colors ${showCouponsList ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500 group-hover:bg-orange-100'}`}>
                                        <MdConfirmationNumber size={16} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className={`text-[10px] font-black uppercase tracking-[0.1em] transition-all ${showCouponsList ? 'text-orange-600' : 'text-gray-500'}`}>
                                            HAVE A COUPON?
                                        </p>
                                        <p className='text-[8px] font-bold text-gray-400'>Tap to view available codes</p>
                                    </div>
                                </div>
                                {!appliedCoupon && (
                                    <span className='text-[10px] font-black text-orange-500 uppercase tracking-[0.1em] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm group-hover:bg-orange-100 transition-all'>
                                        {showCouponsList ? "HIDE" : "SHOW"} OFFERS
                                    </span>
                                )}
                            </div>

                            {appliedCoupon ? (
                                /* Applied State */
                                <div className='flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl animate-fadeIn'>
                                    <div className='flex items-center gap-3'>
                                        <MdCheckCircle className='text-green-500 shrink-0' size={22} />
                                        <div>
                                            <p className='font-black text-green-700 text-sm'>"{appliedCoupon.name}" applied!</p>
                                            <p className='text-green-600 text-xs font-medium'>
                                                {appliedCoupon.type === 'percentage'
                                                    ? `${appliedCoupon.value}% off`
                                                    : `₹${appliedCoupon.value} off`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => { setAppliedCoupon(null); setCouponInput(""); setCouponError(""); }}
                                        className='p-2 rounded-xl hover:bg-green-100 text-green-600 transition-all active:scale-90'
                                    >
                                        <MdClose size={18} />
                                    </button>
                                </div>
                            ) : (
                                /* Input State */
                                <div className='space-y-4'>
                                    {showCouponsList && !appliedCoupon && (
                                        <div className='animate-fadeIn mb-4'>
                                            {availableCoupons.length > 0 ? (
                                                <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide'>
                                                    {availableCoupons.map((cpn, index) => (
                                                        <div 
                                                            key={index}
                                                            onClick={async () => {
                                                                if (couponLoading) return;
                                                                setCouponInput(cpn.name);
                                                                setCouponError("");
                                                                setCouponLoading(true);
                                                                const result = await applyCoupon(cpn.name);
                                                                if (!result.success) setCouponError(result.message);
                                                                setCouponLoading(false);
                                                                setShowCouponsList(false); // Hide after applying
                                                            }}
                                                            className='shrink-0 cursor-pointer bg-orange-50 border border-orange-100 hover:bg-orange-100 hover:border-orange-200 px-4 py-3 rounded-2xl transition-all flex flex-col items-start min-w-[120px] shadow-sm active:scale-95'
                                                        >
                                                            <div className='flex items-center gap-1.5 mb-1'>
                                                                <MdConfirmationNumber className='text-orange-500' size={14} />
                                                                <span className='font-black text-orange-600 text-xs tracking-widest'>{cpn.name}</span>
                                                            </div>
                                                            <span className='text-[9px] text-gray-500 font-black uppercase'>
                                                                {cpn.type === 'percentage' ? `${cpn.value}% DISCOUNT` : `₹${cpn.value} FLAT OFF`}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className='p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center'>
                                                    <p className='text-xs font-bold text-gray-400'>No coupon codes available right now.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {showCouponsList && availableCoupons.length > 3 && (
                                        <div className='grid grid-cols-1 gap-3 animate-fadeIn mb-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-orange-200'>
                                            {availableCoupons.slice(3).map((cpn, index) => (
                                                <div 
                                                    key={index} 
                                                    onClick={async () => {
                                                        setCouponInput(cpn.name);
                                                        setCouponError("");
                                                        setCouponLoading(true);
                                                        const result = await applyCoupon(cpn.name);
                                                        if (!result.success) setCouponError(result.message);
                                                        setCouponLoading(false);
                                                        setShowCouponsList(false);
                                                    }}
                                                    className='group cursor-pointer bg-orange-50/50 border-2 border-dashed border-orange-200 p-4 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center justify-between relative overflow-hidden'
                                                >
                                                    <div className='relative z-10'>
                                                        <p className='font-black text-orange-600 text-sm tracking-widest mb-0.5 group-hover:scale-105 transition-transform origin-left'>{cpn.name}</p>
                                                        <p className='text-[10px] text-gray-500 font-bold'>
                                                            {cpn.type === 'percentage' ? `${cpn.value}% DISCOUNT` : `₹${cpn.value} FLAT OFF`}
                                                        </p>
                                                    </div>
                                                    <div className='bg-orange-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black group-hover:bg-orange-600 transition-all relative z-10'>
                                                        APPLY
                                                    </div>
                                                    <div className='absolute -right-4 -bottom-4 w-16 h-16 bg-orange-100/50 rounded-full group-hover:scale-150 transition-transform duration-500'></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className='flex gap-3'>
                                    <div className='flex-1 relative'>
                                        <input
                                            type='text'
                                            value={couponInput}
                                            onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                            placeholder='Enter coupon code'
                                            className={`w-full px-5 py-4 bg-white border rounded-2xl outline-none font-bold text-gray-800 text-sm tracking-widest placeholder:tracking-normal placeholder:font-normal transition-all shadow-sm ${
                                                couponError
                                                    ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/5'
                                                    : 'border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5'
                                            }`}
                                        />
                                        {couponError && (
                                            <p className='text-red-500 text-[11px] font-bold mt-1.5 ml-1 animate-fadeIn'>
                                                ❌ {couponError}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type='button'
                                        disabled={!couponInput.trim() || couponLoading}
                                        onClick={async () => {
                                            if (!couponInput.trim()) return;
                                            setCouponLoading(true);
                                            setCouponError("");
                                            const result = await applyCoupon(couponInput.trim());
                                            if (!result.success) setCouponError(result.message);
                                            else setCouponInput("");
                                            setCouponLoading(false);
                                        }}
                                        className='px-5 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0'
                                    >
                                        {couponLoading ? (
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                        ) : 'Apply'}
                                    </button>
                                </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="w-full lg:w-[420px] shrink-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden h-fit'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -mr-16 -mt-16'></div>

                        <h2 className='text-2xl font-black text-gray-800 mb-8 flex items-center gap-3'>
                            <div className='w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500'>
                                <MdShoppingBag size={22} />
                            </div>
                            Order Summary
                        </h2>

                        <div className='space-y-4 px-1'>

                            {/* Items Breakdown */}
                            <div className='space-y-2 mb-4'>
                                {(() => {
                                    const displayItems = [];
                                    let thaliInCart = false;

                                    food_list.forEach(item => {
                                        if (cartItems[item._id] > 0) {
                                            if (isThali(item)) {
                                                thaliInCart = true;
                                                if (!hasSubscription) {
                                                    displayItems.push({ ...item, qty: cartItems[item._id], price: getCalculatedPrice(item) });
                                                }
                                            } else if (!item.isComboAddon) {
                                                displayItems.push({ ...item, qty: cartItems[item._id], price: getCalculatedPrice(item) });
                                            }
                                        }
                                    });

                                    if (hasSubscription && thaliInCart) {
                                        const matchingRule = (subscriptionPrices || []).find(
                                            rule => rule.plan === globalPlanConfig.orderType &&
                                                rule.mealTiming === globalPlanConfig.mealTime &&
                                                rule.mealPreference === globalPlanConfig.mealType
                                        );
                                        displayItems.unshift({
                                            _id: 'subscription_thali',
                                            name: 'Subscription Thali',
                                            qty: 1,
                                            price: matchingRule ? matchingRule.price : 0,
                                            isSubscription: true,
                                            mealTiming: globalPlanConfig.mealTime
                                        });
                                    }

                                    return displayItems.map((item) => (
                                        <div key={item._id} className='flex items-start justify-between gap-2 py-2 border-b border-gray-50'>
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-sm font-bold text-gray-800 truncate'>{item.name}</p>
                                                {item.isSubscription && (
                                                    <span className='text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 inline-block mt-0.5'>
                                                        {item.mealTiming === 'Lunch' ? '🌞 Lunch' : item.mealTiming === 'Dinner' ? '🌙 Dinner' : '✨ Both'}
                                                    </span>
                                                )}
                                                {!item.isSubscription && (isThali(item)) && (
                                                    <span className='text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 inline-block mt-0.5'>
                                                        {globalPlanConfig.mealTime === 'Lunch' ? '🌞 Lunch' : '🌙 Dinner'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className='text-right shrink-0'>
                                                <p className='text-xs font-black text-gray-400 mb-0.5'>x{item.qty}</p>
                                                <p className='text-sm font-black text-gray-800'>₹{item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>

                        {(() => {
                            const subtotal = getTotalCartAmountDynamic();
                            const deliveryFee = getDeliveryFee(subtotal, data.address);
                            const gstTotal = getGSTAmount(subtotal) + getChargesAmount(subtotal);
                            const baseDiscount = getDiscountAmount();
                            const isFullDiscount = appliedCoupon && appliedCoupon.type === 'percentage' && appliedCoupon.value === 100;
                            const finalDiscount = isFullDiscount ? (subtotal + deliveryFee + gstTotal) : baseDiscount;
                            const totalAmount = isFullDiscount ? 0 : (subtotal + deliveryFee + gstTotal - baseDiscount);

                            return (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <p className='text-xs uppercase tracking-widest'>Subtotal</p>
                                        <p className='text-gray-800 text-lg'>₹{subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <p className='text-xs uppercase tracking-widest'>Delivery Fee</p>
                                        <p className='text-gray-800 text-lg'>+ ₹{deliveryFee.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <p className='text-xs uppercase tracking-widest'>GST and Charges</p>
                                        <p className='text-gray-800 text-lg'>+ ₹{gstTotal.toFixed(2)}</p>
                                    </div>
                                    {finalDiscount > 0 && (
                                        <div className="flex justify-between items-center bg-green-50/80 p-3 rounded-2xl border border-green-100 font-bold animate-fadeIn mt-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <MdConfirmationNumber size={16} />
                                                </div>
                                                <div>
                                                    <p className='text-[11px] uppercase tracking-widest text-green-700 font-black'>Coupon Savings</p>
                                                    {appliedCoupon && (
                                                        <p className='text-[10px] text-green-600 font-bold mt-0.5'>Applied: {appliedCoupon.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className='text-green-600 text-lg'>- ₹{finalDiscount.toFixed(2)}</p>
                                        </div>
                                    )}

                                    <div className='h-[1px] bg-gray-50 w-full my-6'></div>

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1'>Total Amount</p>
                                            <p className='text-3xl font-black text-orange-600 tracking-tighter'>₹{totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className='bg-orange-50 text-orange-600 p-3 rounded-2xl border border-orange-100'>
                                            <MdPayment size={24} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                        </div>

                        {/* After Hours Notice */}
                        {!isWithinSchedule && (
                            <div className='mt-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3 animate-fadeIn relative z-10'>
                                <span className='text-orange-500 text-xl mt-0.5'>⏰</span>
                                <div>
                                    <p className='font-black text-orange-700 text-sm'>Order time is currently closed</p>
                                    <p className='text-orange-600 text-xs font-medium mt-0.5'>
                                        Your order will be queued and processed starting from <span className='font-black'>{generalSettings?.onlineFrom || "opening time"}</span>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Method Selection */}
                        <div className="mt-6 mb-2">
                            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-3'>Payment Method</p>
                            <div className="flex flex-col gap-3">
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="online" 
                                        checked={paymentMethod === 'online'} 
                                        onChange={() => setPaymentMethod('online')}
                                        className="w-5 h-5 accent-orange-500 cursor-pointer"
                                    />
                                    <span className="font-black text-gray-800">Online Payment (UPI/Cards)</span>
                                </label>
                                
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${hasSubscription ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' : (paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'cursor-pointer border-gray-100 bg-white hover:border-gray-200')}`}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="cod" 
                                        checked={paymentMethod === 'cod'} 
                                        onChange={() => setPaymentMethod('cod')}
                                        disabled={hasSubscription}
                                        className="w-5 h-5 accent-orange-500 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <div className="flex flex-col">
                                        <span className={`font-black ${hasSubscription ? 'text-gray-400' : 'text-gray-800'}`}>Cash on Delivery</span>
                                        {hasSubscription && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">Not available for subscriptions</span>}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-5 rounded-2xl font-black tracking-wider hover:from-orange-700 hover:to-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10'
                        >
                            {loading ? (
                                <>PROCESSING... <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div></>
                            ) : (
                                <>{paymentMethod === 'cod' ? 'PLACE ORDER' : 'PROCEED TO PAYMENT'} <MdArrowForward size={22} /></>
                            )}
                        </button>

                        <div className='mt-6 flex flex-col items-center gap-2'>
                            
                            <div className='flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                                <span className='w-1 h-1 bg-green-500 rounded-full'></span>
                                Secure Payment Gateway
                            </div>
                            <p className='text-[9px] text-gray-300 font-medium text-center px-4'>By proceeding, you agree to our terms and conditions for secure food delivery.</p>
                        </div>
                    </div>
                </div>
            </form>

            {/* Success Popup Modal */}
            {showSuccessPopup && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fadeIn'>
                    <div className='bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full text-center relative shadow-2xl overflow-hidden'>
                        {/* Decorative Background */}
                        <div className='absolute top-0 right-0 w-32 h-32 bg-green-100/40 rounded-full blur-2xl -mr-16 -mt-16'></div>
                        <div className='absolute bottom-0 left-0 w-32 h-32 bg-orange-100/40 rounded-full blur-2xl -ml-16 -mb-16'></div>

                        <div className='relative z-10'>
                            <div className='w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100 shadow-inner'>
                                <MdCheckCircle size={48} className="animate-bounce" style={{ animationDuration: '2s' }} />
                            </div>
                            <h3 className='text-3xl font-black text-gray-800 mb-3 tracking-tight'>Order Placed!</h3>
                            <p className='text-gray-500 text-sm font-medium mb-8 leading-relaxed'>
                                Awesome! We've received your order and will start preparing your delicious meal right away.
                            </p>
                            
                            <div className='flex flex-col gap-3'>
                                <button 
                                    onClick={() => {
                                        setShowSuccessPopup(false);
                                        navigate('/myorders');
                                    }} 
                                    className='w-full py-4 bg-orange-500 text-white rounded-2xl font-black tracking-widest text-sm shadow-lg shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2'
                                >
                                    <MdShoppingBag size={18} />
                                    TRACK ORDER
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowSuccessPopup(false);
                                        navigate('/');
                                    }} 
                                    className='w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-black tracking-widest text-sm hover:bg-gray-100 active:scale-95 transition-all'
                                >
                                    BACK TO MENU
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlaceOrder
