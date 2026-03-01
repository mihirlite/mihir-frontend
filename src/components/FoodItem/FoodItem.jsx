import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const FoodItem = ({ id, name, price, description, image, veg, inStock = true }) => {

    const { cartItems, addToCart, removeFromCart, url, wishlistItems, addToWishlist, token, setShowLogin } = useContext(StoreContext);
    const navigate = useNavigate();

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
                                    className={`w-full h-full object-cover transition-transform duration-700 ${inStock ? 'group-hover:scale-110' : 'grayscale-[0.5]'}`}
                                    src={img.startsWith("http") ? img : url + "/images/" + img}
                                    alt={`${name} - ${index + 1}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <img
                        className={`w-full h-full object-cover transition-transform duration-700 ${inStock ? 'group-hover:scale-110' : 'grayscale-[0.5]'}`}
                        src={imagesArray[0]?.startsWith("http") ? imagesArray[0] : url + "/images/" + imagesArray[0]}
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
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className='text-lg md:text-xl font-extrabold text-gray-800 line-clamp-1 leading-tight group-hover:text-orange-600 transition-colors'>
                            {name}
                        </h3>
                        <div className={`flex-shrink-0 mt-1 w-4 h-4 border-[1.5px] p-[1.5px] flex justify-center items-center ${veg ? "border-green-600" : "border-red-600"}`}>
                            <div className={`w-full h-full rounded-full ${veg ? "bg-green-600" : "bg-red-600"}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <img className='h-3 md:h-4 w-auto object-contain opacity-80' src="https://raw.githubusercontent.com/avinashdm/food-del/main/frontend/src/assets/rating_starts.png" alt="Rating" />
                        <span className='text-xs text-gray-400 font-medium ml-1'>(4.5)</span>
                    </div>
                </div>

                <p className='text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed min-h-[2.5em]'>
                    {description}
                </p>

                <div className="mt-auto pt-3 flex flex-col gap-3">

                    {/* Price row + inline counter */}
                    <div className="flex items-center justify-between gap-2">
                        <p className='text-orange-600 text-lg xs:text-xl md:text-2xl font-black tracking-tight'>
                            ₹{price}
                        </p>

                        {inStock && (
                            <div className='flex items-center gap-1.5 bg-gray-50 border border-gray-200 p-1 rounded-full'>
                                <div
                                    onClick={() => cartItems && cartItems[id] && removeFromCart(id)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg select-none transition-colors
                                        ${cartItems && cartItems[id]
                                            ? 'cursor-pointer text-red-500 bg-red-50 hover:bg-red-100'
                                            : 'text-gray-300 bg-gray-100 cursor-default'}`}
                                >−</div>
                                <p className='text-sm font-bold w-5 text-center text-gray-800'>
                                    {(cartItems && cartItems[id]) || 1}
                                </p>
                                <div
                                    onClick={handleAddToCart}
                                    className='cursor-pointer text-green-600 bg-green-50 hover:bg-green-100 w-8 h-8 flex items-center justify-center rounded-full transition-colors font-bold text-lg select-none'
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
