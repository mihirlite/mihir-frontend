import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdPayment, MdLocationOn, MdShoppingBag, MdArrowForward } from 'react-icons/md';

const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        }
        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                alert("Error placing order");
            }
        } catch (error) {
            console.error(error);
            alert("Payment service error");
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token, getTotalCartAmount, navigate])

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
                            <p className='text-gray-500 text-sm font-medium'>Where should we send your delicious meal?</p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className='flex-1 group'>
                                <input required name='firstName' onChange={onChangeHandler} value={data.firstName}
                                    className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                    type="text" placeholder='First name'
                                />
                            </div>
                            <div className='flex-1 group'>
                                <input required name='lastName' onChange={onChangeHandler} value={data.lastName}
                                    className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                    type="text" placeholder='Last name'
                                />
                            </div>
                        </div>

                        <input required name='email' onChange={onChangeHandler} value={data.email}
                            className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                            type="email" placeholder='Email address'
                        />

                        <input required name='street' onChange={onChangeHandler} value={data.street}
                            className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                            type="text" placeholder='Street'
                        />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input required name='city' onChange={onChangeHandler} value={data.city}
                                className='flex-1 px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                type="text" placeholder='City'
                            />
                            <input required name='state' onChange={onChangeHandler} value={data.state}
                                className='flex-1 px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                type="text" placeholder='State'
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode}
                                className='flex-1 px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                type="text" placeholder='Zip code'
                            />
                            <input required name='country' onChange={onChangeHandler} value={data.country}
                                className='flex-1 px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                                type="text" placeholder='Country'
                            />
                        </div>

                        <input required name='phone' onChange={onChangeHandler} value={data.phone}
                            className='w-full px-6 py-4.5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold text-gray-800 shadow-sm'
                            type="text" placeholder='Phone number'
                        />
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
                            <div className="flex justify-between items-center text-gray-500 font-bold">
                                <p className='text-xs uppercase tracking-widest'>Subtotal</p>
                                <p className='text-gray-800 text-lg'>${getTotalCartAmount()}.00</p>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 font-bold">
                                <p className='text-xs uppercase tracking-widest'>Delivery Fee</p>
                                <p className='text-gray-800 text-lg'>+ $2.00</p>
                            </div>

                            <div className='h-[1px] bg-gray-50 w-full my-6'></div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1'>Total Amount</p>
                                    <p className='text-3xl font-black text-orange-600 tracking-tighter'>${getTotalCartAmount() + 2}.00</p>
                                </div>
                                <div className='bg-orange-50 text-orange-600 p-3 rounded-2xl border border-orange-100'>
                                    <MdPayment size={24} />
                                </div>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='w-full mt-10 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-5 rounded-2xl font-black tracking-wider hover:from-orange-700 hover:to-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center justify-center gap-3 relative z-10'
                        >
                            PROCEED TO PAYMENT <MdArrowForward size={22} />
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
        </div>
    )
}

export default PlaceOrder
