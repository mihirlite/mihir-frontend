import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const FoodItem = ({ id, name, price, description, image, veg, inStock = true, discount = 0 }) => {

    const { cartItems, addToCart, removeFromCart, url, wishlistItems, addToWishlist, token, setShowLogin, getImageUrl } = useContext(StoreContext);
    const navigate = useNavigate();

    // Calculate discounted price
    const discountedPrice = discount > 0 ? Math.floor(price - (price * discount / 100)) : price;

    // Standardize images to an array
    const imagesArray = Array.isArray(image) ? image : [image];

    const handleOrderNow = () => {
        if (!inStock) return;
        if (!token) {
            setShowLogin(true);
            return;
        }
        addToCart(id);
        navigate('/cart');
    }

    const handleAddToCart = () => {
        if (!token) {
            setShowLogin(true);
            return;
        }
        addToCart(id);
    }

    return (
        <div className={`group w-full m-auto rounded-[24px] shadow-md hover:shadow-2xl bg-white transition-all duration-300 animate-fadeIn relative flex flex-col overflow-hidden hover:-translate-y-2 border border-transparent hover:border-orange-100 ${!inStock ? 'opacity-90' : ''}`}>
            {/* Status Badge */}
            <div className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm
                ${inStock ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'}`}>
                {inStock ? '● In Stock' : '● Out of Stock'}
            </div>

            {/* Food Image Carousel */}
            <div className="relative overflow-hidden h-[180px] xs:h-[220px] md:h-[240px] w-full bg-gray-100 product-swiper">
                {imagesArray.length > 1 ? (
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="h-full w-full"
                    >
                        {imagesArray.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    loading="lazy"
                                    className={`w-full h-full object-cover transition-transform duration-700 ${inStock ? 'group-hover:scale-110' : 'grayscale-[0.5]'}`}
                                    src={getImageUrl(img)}
                                    alt={`${name} - ${index + 1}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <img
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 ${inStock ? 'group-hover:scale-110' : 'grayscale-[0.5]'}`}
                        src={getImageUrl(imagesArray[0])}
                        alt={name}
                    />
                )}
                {!inStock && (
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-10'>
                        <span className="bg-white/90 text-red-600 px-4 py-2 rounded-lg font-extrabold text-sm uppercase tracking-widest shadow-lg rotate-[-12deg] border-2 border-red-500">
                            Sold Out
                        </span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Card Body */}
            <div className="p-4 xs:p-5 md:p-6 flex flex-col flex-1 gap-3">
                <div className="flex flex-col items-center sm:items-start gap-1">
                    <div className="flex items-center sm:items-start justify-center sm:justify-between gap-2 w-full">
                        <h3 className='text-lg md:text-xl font-extrabold text-gray-800 line-clamp-1 leading-tight group-hover:text-orange-600 transition-colors text-center sm:text-left'>
                            {name}
                        </h3>
                        <div className={`flex-shrink-0 w-4 h-4 border-[1.5px] p-[1.5px] flex justify-center items-center ${veg ? "border-green-600" : "border-red-600"}`}>
                            <div className={`w-full h-full rounded-full ${veg ? "bg-green-600" : "bg-red-600"}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1 w-full">
                        <div className='flex text-orange-400 text-[10px] md:text-sm'>
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < 4 ? "fill-orange-400" : "fill-gray-200"}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className='text-[10px] md:text-xs text-gray-400 font-bold ml-1'>(4.5)</span>
                    </div>
                </div>

                <p className='text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed min-h-[2.5em] text-center sm:text-left'>
                    {description}
                </p>

                <div className="mt-auto pt-3 flex flex-col gap-3">

                    {/* Price row + inline counter */}
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className='flex flex-col'>
                            {discount > 0 && (
                                <div className='flex items-center gap-2'>
                                    <span className='text-xs text-gray-400 line-through font-bold'>₹{price}</span>
                                    <span className='bg-red-50 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-red-100 uppercase tracking-tighter'>-{discount}% OFF</span>
                                </div>
                            )}
                            <p className='text-orange-600 text-xl xs:text-2xl md:text-3xl font-black tracking-tight'>
                                ₹{discountedPrice}
                            </p>
                        </div>

                        {inStock && (
                            <div className='flex items-center gap-1.5 bg-gray-50 border border-gray-200 p-1 rounded-full shadow-sm'>
                                <div
                                    onClick={() => cartItems && cartItems[id] && removeFromCart(id)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg select-none transition-all
                                        ${cartItems && cartItems[id]
                                            ? 'cursor-pointer text-red-500 bg-red-50 hover:bg-orange-100'
                                            : 'text-gray-300 bg-gray-100 cursor-default'}`}
                                >−</div>
                                <p className='text-sm font-black w-5 text-center text-gray-800'>
                                    {(cartItems && cartItems[id]) || 1}
                                </p>
                                <div
                                    onClick={handleAddToCart}
                                    className='cursor-pointer text-green-600 bg-green-50 hover:bg-green-100 w-8 h-8 flex items-center justify-center rounded-full transition-all font-bold text-lg select-none'
                                >+</div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 w-full'>
                        <button
                            disabled={!inStock}
                            onClick={() => addToCart(id)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm md:text-base border-2 transition-all duration-300 transform active:scale-95
                                ${inStock
                                    ? 'border-orange-500 text-orange-600 hover:bg-orange-50'
                                    : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                        >
                            Add to Cart
                        </button>
                        <button
                            disabled={!inStock}
                            onClick={handleOrderNow}
                            className={`flex-1 py-2.5 xs:py-3 rounded-xl font-bold text-xs xs:text-sm md:text-base shadow-md transition-all duration-300 transform active:scale-95
                                ${inStock
                                    ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-200'
                                    : 'bg-gray-200 text-white cursor-not-allowed shadow-none'}`}
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FoodItem
