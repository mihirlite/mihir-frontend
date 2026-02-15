import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdAddShoppingCart, MdLocalOffer, MdArrowForward } from 'react-icons/md';

const Cart = () => {

    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();

    const hasItems = Object.values(cartItems).some(count => count > 0);

    return (
        <div className='max-w-[1280px] mx-auto px-4 pt-28 pb-20 animate-fadeIn'>
            {!hasItems ? (
                <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4'>
                    <div className='w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6 drop-shadow-xl'>
                        <MdAddShoppingCart size={48} />
                    </div>
                    <h2 className='text-3xl font-black text-gray-800 mb-2'>Your cart is empty</h2>
                    <p className='text-gray-500 mb-8 max-w-sm'>Looks like you haven't added anything to your cart yet. Let's find something delicious!</p>
                    <button
                        onClick={() => navigate('/#menu')}
                        className='px-10 py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center gap-2'
                    >
                        Browse Menu <MdArrowForward size={20} />
                    </button>
                </div>
            ) : (
                <>
                    <div className='flex flex-col lg:flex-row gap-12 items-start'>
                        {/* Cart Items Section */}
                        <div className='flex-1 w-full'>
                            <div className='flex items-center justify-between mb-8'>
                                <h1 className='text-3xl font-black text-gray-800 tracking-tight'>Shopping Cart</h1>
                                <span className='bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full font-bold text-sm border border-orange-100'>
                                    {Object.values(cartItems).reduce((a, b) => a + b, 0)} Items
                                </span>
                            </div>

                            <div className="cart-items space-y-6">
                                {/* Desktop Header */}
                                <div className="hidden md:grid grid-cols-[1fr_2.5fr_1fr_1fr_1.2fr_0.5fr] items-center text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] pb-6 px-4">
                                    <p>Image</p>
                                    <p>Product</p>
                                    <p>Price</p>
                                    <p>Qty</p>
                                    <p>Total</p>
                                    <p className='text-right'>Action</p>
                                </div>

                                <div className='flex flex-col gap-5'>
                                    {food_list.map((item, index) => {
                                        if (cartItems[item._id] > 0) {
                                            return (
                                                <div
                                                    key={index}
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                    className='group transition-all animate-fadeIn'
                                                >
                                                    {/* Mobile Card Layout */}
                                                    <div className='md:hidden flex items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden'>
                                                        <div className='w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-gray-50'>
                                                            <img className='w-full h-full object-cover transition-transform group-hover:scale-110 duration-500' src={url + "/images/" + item.image} alt={item.name} />
                                                        </div>
                                                        <div className='ml-4 flex-1 flex flex-col justify-between py-1'>
                                                            <div>
                                                                <h3 className='font-black text-gray-800 text-lg leading-tight mb-1'>{item.name}</h3>
                                                                <p className='text-orange-500 font-bold'>${item.price}</p>
                                                            </div>
                                                            <div className='flex items-center justify-between mt-3'>
                                                                <div className='flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100'>
                                                                    <span className='text-[10px] font-black text-gray-400 uppercase tracking-tighter'>Qty</span>
                                                                    <span className='font-black text-gray-800 text-sm'>{cartItems[item._id]}</span>
                                                                </div>
                                                                <p className='font-black text-gray-800'>${item.price * cartItems[item._id]}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item._id)}
                                                            className='absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm'
                                                        >
                                                            <MdDeleteOutline size={18} />
                                                        </button>
                                                    </div>

                                                    {/* Desktop Row Layout */}
                                                    <div className='hidden md:grid grid-cols-[1fr_2.5fr_1fr_1fr_1.2fr_0.5fr] items-center bg-white p-5 rounded-[2rem] border border-transparent hover:border-orange-100 hover:bg-orange-50/20 hover:shadow-xl hover:shadow-orange-50/50 transition-all duration-300'>
                                                        <div className='w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm'>
                                                            <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' src={url + "/images/" + item.image} alt={item.name} />
                                                        </div>
                                                        <div className='pr-4 px-2'>
                                                            <p className='font-black text-gray-800 text-lg tracking-tight'>{item.name}</p>
                                                            <p className='text-xs text-gray-400 font-bold truncate uppercase tracking-widest mt-1'>Fresh Ingredients Only</p>
                                                        </div>
                                                        <p className='text-gray-500 font-bold'>${item.price}</p>
                                                        <div>
                                                            <div className='bg-gray-50 w-fit px-4 py-2 rounded-xl text-sm font-black text-gray-800 border border-gray-100'>
                                                                {cartItems[item._id]}
                                                            </div>
                                                        </div>
                                                        <p className='text-orange-600 font-black text-xl tracking-tight'>${item.price * cartItems[item._id]}</p>
                                                        <div className='flex justify-end pr-2'>
                                                            <button
                                                                onClick={() => removeFromCart(item._id)}
                                                                className='p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm group-hover:rotate-6'
                                                            >
                                                                <MdDeleteOutline size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Promo Section */}
                        <div className='w-full lg:w-[400px] shrink-0 space-y-8'>
                            {/* Summary Card */}
                            <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden'>
                                <div className='absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -mr-16 -mt-16'></div>
                                <h2 className='text-2xl font-black text-gray-800 mb-8 flex items-center gap-3'>
                                    <span className='w-2 h-8 bg-orange-500 rounded-full'></span>
                                    Cart Totals
                                </h2>

                                <div className='space-y-4'>
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <p className='text-sm uppercase tracking-widest'>Subtotal</p>
                                        <p className='text-gray-800 text-lg'>${getTotalCartAmount()}.00</p>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <p className='text-sm uppercase tracking-widest'>Delivery</p>
                                        <p className='text-gray-800 text-lg'>+ $2.00</p>
                                    </div>
                                    <div className='h-[1px] bg-gray-50 w-full my-4'></div>
                                    <div className="flex justify-between items-center">
                                        <p className='text-xs font-black text-gray-400 uppercase tracking-[0.2em]'>Grand Total</p>
                                        <p className='text-3xl font-black text-orange-600 tracking-tighter'>${getTotalCartAmount() + 2}.00</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/order')}
                                    className='w-full mt-10 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-5 rounded-2xl font-black tracking-wider hover:from-orange-700 hover:to-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center justify-center gap-3'
                                >
                                    PROCEED TO CHECKOUT <MdArrowForward size={22} />
                                </button>

                                <p className='mt-4 text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest'>Secure Checkout Experience</p>
                            </div>

                            {/* Promo Code Box */}
                            <div className='bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-gray-900/10 text-white relative overflow-hidden group'>
                                <div className='absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -ml-12 -mb-12 group-hover:bg-orange-500/20 transition-all'></div>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center'>
                                        <MdLocalOffer className='text-orange-400' size={20} />
                                    </div>
                                    <p className='font-black text-sm uppercase tracking-widest'>Have a Promo Code?</p>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                                    <input
                                        type="text"
                                        placeholder='Enter code...'
                                        className='flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-500 font-bold'
                                    />
                                    <button className='bg-white text-gray-900 px-8 py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all active:scale-95'>
                                        APPLY
                                    </button>
                                </div>
                                <p className='mt-4 text-[10px] text-gray-500 font-bold'>OFFER APPLIES AT CHECKOUT</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart
