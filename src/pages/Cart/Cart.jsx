import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdRemove, MdClose, MdCheckCircle, MdArrowForward } from 'react-icons/md';

const Cart = () => {

    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();

    const hasItems = Object.values(cartItems).some(count => count > 0);
    const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);

    const subtotal = getTotalCartAmount();
    const delivery = (subtotal > 0 && subtotal < 499) ? 30 : 0;
    const gst = subtotal > 0 ? 18 : 0;
    const total = subtotal + delivery + gst;

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
                                    document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' });
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
                            {food_list.map((item, index) => {
                                if (cartItems[item._id] > 0) {
                                    return (
                                        <div key={index} className='flex gap-4 items-start relative pb-6 border-b border-gray-50 last:border-0 last:pb-0'>
                                            {/* Item Image */}
                                            <div className='relative shrink-0'>
                                                <div className='w-24 h-24 md:w-28 md:h-28 rounded-[24px] overflow-hidden border border-gray-100'>
                                                    <img className='w-full h-full object-cover' src={url + "/images/" + item.image} alt={item.name} />
                                                </div>
                                                {item.veg === false && !item.name.toLowerCase().includes("thali") && (
                                                    <div className='absolute bottom-0 left-0 w-full bg-green-600/90 text-white text-[10px] font-black text-center py-1 rounded-b-[24px] backdrop-blur-sm'>
                                                        Customizable
                                                    </div>
                                                )}
                                                {/* Fallback mock for "Customizable" as per mockup */}
                                                {item.name.includes("Paneer") && (
                                                    <div className='absolute bottom-0 left-0 w-full bg-[#388e3c]/90 text-white text-[10px] font-black text-center py-1 rounded-b-[24px]'>
                                                        Customizable
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item Details */}
                                            <div className='flex-1 flex flex-col pt-1'>
                                                <div className='flex justify-between items-start'>
                                                    <h3 className='font-black text-gray-800 text-lg md:text-xl leading-tight'>{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item._id)} className='text-gray-300 hover:text-red-500 transition-colors'>
                                                        <MdClose size={24} />
                                                    </button>
                                                </div>
                                                <p className='text-lg font-black text-gray-800 mt-1'>₹{item.price}</p>

                                                <div className='flex items-center gap-3 mt-4'>
                                                    {/* Qty Selector */}
                                                    <div className='flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1'>
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

                                                    <button
                                                        onClick={() => addToCart(item._id)}
                                                        className='bg-[#ff7e00] text-white px-8 py-3 rounded-xl font-black text-base hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 active:scale-95'
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null;
                            })}
                        </div>

                        {/* Summary Section */}
                        <div className='space-y-4 pt-4'>
                            <div className='flex justify-between items-center text-gray-600 font-bold'>
                                <p className='text-lg'>Subtotal</p>
                                <p className='text-gray-800 text-xl font-black'>₹{subtotal}</p>
                            </div>
                            <div className='flex justify-between items-center text-gray-400 font-bold'>
                                <p className='text-lg'>Delivery</p>
                                <p className='text-gray-800 text-lg font-black'>₹{delivery}</p>
                            </div>
                            <div className='flex justify-between items-center text-gray-400 font-bold'>
                                <p className='text-lg'>GST</p>
                                <p className='text-gray-800 text-lg font-black'>₹{gst}</p>
                            </div>

                            <div className='pt-6 border-t border-gray-100 flex justify-between items-center'>
                                <h3 className='text-2xl font-black text-gray-800 tracking-tight'>Total</h3>
                                <p className='text-3xl font-black text-gray-800'>₹{total}</p>
                            </div>
                        </div>

                        {/* Coupon Box */}
                        <div className='mt-8 flex gap-3'>
                            <input
                                type="text"
                                placeholder="Apply Coupon"
                                className='flex-1 bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 transition-all font-bold placeholder-gray-300'
                            />
                        </div>

                        {/* Free Delivery Promo */}
                        <div className='flex items-center gap-3 py-2'>
                            <MdCheckCircle className='text-green-500 text-2xl' />
                            <p className='text-green-700 font-black text-sm md:text-base'>
                                {subtotal >= 499 ? 'You unlocked Free Delivery!' : 'Free delivery above ₹499'}
                            </p>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={() => navigate('/order')}
                            className='w-full mt-6 bg-[#ff7e00] text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center justify-center gap-2'
                        >
                            Proceed to Checkout <MdArrowForward size={24} />
                        </button>

                        {/* Gray bar at bottom like mockup */}
                        <div className='w-[100px] h-1.5 bg-gray-100 rounded-full mx-auto mt-4'></div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart
