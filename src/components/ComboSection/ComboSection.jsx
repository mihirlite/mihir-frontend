import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { MdAdd, MdRestaurantMenu, MdLocalOffer, MdFlashOn } from 'react-icons/md'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const ComboSection = () => {
    const { food_list, addToCart, cartItems, url } = useContext(StoreContext);

    const combos = food_list.filter(item => item.category === "Combos");

    if (combos.length === 0) return null;

    return (
        <section className='py-12 md:py-20 animate-fadeIn' id='combos'>
            <div className='flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='w-2 h-10 bg-gradient-to-b from-orange-600 to-orange-400 rounded-full shadow-lg shadow-orange-100'></div>
                    <div>
                        <h2 className='text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase'>
                            Today's <span className='text-orange-500'>Special Combos</span>
                        </h2>
                        <p className='text-gray-500 font-bold mt-1 tracking-wide'>Save more with our curated value meals</p>
                    </div>
                </div>
                <div className='hidden md:flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100'>
                    <MdFlashOn className='text-orange-500 text-xl' />
                    <span className='text-xs font-black text-orange-600 uppercase tracking-widest'>Limited Time Offers</span>
                </div>
            </div>

            <div className='relative'>
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1.2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2.5 },
                        1280: { slidesPerView: 3 }
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="combo-swiper !pb-14 !px-4 md:!px-0"
                >
                    {combos.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className='group relative bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col'>
                                {/* Image Container */}
                                <div className='relative h-64 md:h-72 overflow-hidden'>
                                    <img
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000'
                                        src={(Array.isArray(item.image) ? item.image[0] : item.image).startsWith("http")
                                            ? (Array.isArray(item.image) ? item.image[0] : item.image)
                                            : url + "/images/" + (Array.isArray(item.image) ? item.image[0] : item.image)
                                        }
                                        alt={item.name}
                                    />
                                    
                                    {/* Badges */}
                                    <div className='absolute top-4 left-4 flex flex-col gap-2'>
                                        {item.discount > 0 && (
                                            <div className='bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1 backdrop-blur-md bg-opacity-90'>
                                                <MdLocalOffer /> {item.discount}% OFF
                                            </div>
                                        )}
                                        <div className='bg-white text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest flex items-center gap-1 backdrop-blur-md bg-opacity-90'>
                                            <MdRestaurantMenu className='text-orange-500' /> {item.veg ? 'Pure Veg' : 'Non-Veg'}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className='p-8 flex-1 flex flex-col'>
                                    <div className='flex justify-between items-start mb-4'>
                                        <h3 className='text-2xl font-black text-gray-800 leading-tight group-hover:text-orange-500 transition-colors'>
                                            {item.name}
                                        </h3>
                                        <div className='text-right'>
                                            <span className='block text-2xl font-black text-gray-900 leading-none'>₹{item.price}</span>
                                            {item.discount > 0 && (
                                                <span className='text-xs text-gray-400 line-through font-bold'>₹{Math.floor(item.price / (1 - item.discount / 100))}</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className='text-gray-500 font-medium text-sm line-clamp-2 mb-8'>
                                        {item.description}
                                    </p>

                                    <div className='mt-auto pt-6 border-t border-gray-50 flex items-center justify-between'>
                                        <div className='flex flex-col'>
                                            <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Perfect for</span>
                                            <span className='text-xs font-bold text-gray-600'>Hungry Souls</span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(item._id)}
                                            className={`
                                                flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black transition-all duration-300 shadow-xl
                                                ${cartItems[item._id] > 0
                                                    ? 'bg-green-500 text-white shadow-green-100 scale-95'
                                                    : 'bg-gray-900 text-white hover:bg-orange-500 shadow-gray-200 hover:shadow-orange-100 hover:-translate-y-1'
                                                }
                                            `}
                                        >
                                            {cartItems[item._id] > 0 ? (
                                                <>Added ({cartItems[item._id]})</>
                                            ) : (
                                                <>
                                                    <MdAdd size={20} />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Decorative Element */}
                                <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left'></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Custom Swiper Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .combo-swiper .swiper-pagination-bullet { background: #cbd5e1; opacity: 1; }
                .combo-swiper .swiper-pagination-bullet-active { background: #ff7e00; width: 24px; border-radius: 4px; }
                .combo-swiper .swiper-button-next, .combo-swiper .swiper-button-prev { 
                    color: #fff; background: #0f172a; width: 44px; height: 44px; border-radius: 12px; 
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); transition: all 0.3s;
                }
                .combo-swiper .swiper-button-next:hover, .combo-swiper .swiper-button-prev:hover { background: #ff7e00; transform: scale(1.1); }
                .combo-swiper .swiper-button-next:after, .combo-swiper .swiper-button-prev:after { font-size: 18px; font-weight: 900; }
                .combo-swiper .swiper-button-next { right: -10px; }
                .combo-swiper .swiper-button-prev { left: -10px; }
                @media (max-width: 1024px) {
                    .combo-swiper .swiper-button-next, .combo-swiper .swiper-button-prev { display: none !important; }
                }
            `}} />
        </section>
    )
}

export default ComboSection
