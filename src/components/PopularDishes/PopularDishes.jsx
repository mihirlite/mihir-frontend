import React, { useContext } from 'react'
import veg_thali from '../../assets/veg_thali.png'
import { FaStar } from "react-icons/fa"
import { StoreContext } from '../../context/StoreContext'

const PopularDishes = () => {
    const { token, setShowLogin, addToCart } = useContext(StoreContext);

    const dishes = [
        {
            id: "biryani_01",
            name: "Chicken Biryani",
            image: "https://images.pexels.com/photos/12737651/pexels-photo-12737651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "199",
            rating: 4.5,
            reviews: 120
        },
        {
            id: "veg_thali_01",
            name: "Veg Thali",
            image: veg_thali,
            price: "149",
            rating: 4.7,
            reviews: 150
        },
        {
            id: "paneer_butter_masala_01",
            name: "Paneer Butter Masala",
            image: "https://images.pexels.com/photos/9609835/pexels-photo-9609835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            price: "179",
            rating: 4.6,
            reviews: 200
        }
    ]

    const handleAddToCart = (id) => {
        if (!token) {
            setShowLogin(true);
            return;
        }
        addToCart(id);
    }

    return (
        <section className='w-full px-4 sm:px-6 md:w-[85%] lg:w-[80%] m-auto py-12 md:py-24'>
            <h2 className='text-center text-3xl md:text-5xl font-black text-[#323232] mb-12 md:mb-16'>
                Popular Dishes
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
                {dishes.map((dish, index) => (
                    <div key={index} className='bg-white rounded-[32px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 group'>
                        {/* Image Container */}
                        <div className='w-full h-56 sm:h-64 md:h-72 mb-6 rounded-[24px] overflow-hidden'>
                            <img
                                src={dish.image}
                                alt={dish.name}
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                            />
                        </div>

                        {/* Content Area */}
                        <div className='px-2'>
                            <h3 className='text-2xl font-bold text-[#323232] mb-2'>{dish.name}</h3>
                            <p className='text-3xl font-black text-[#323232] mb-4'>₹{dish.price}</p>

                            <div className='flex items-center gap-1 mb-6'>
                                <div className='flex text-orange-400'>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.floor(dish.rating) ? "fill-current" : "text-gray-200"} />
                                    ))}
                                </div>
                                <span className='text-gray-400 text-sm ml-2 font-medium'>
                                    {dish.rating} ({dish.reviews})
                                </span>
                            </div>

                            <button
                                onClick={() => handleAddToCart(dish.id)}
                                className='w-full bg-[#2e7d32] text-white py-4 rounded-2xl text-xl font-black hover:bg-[#25632a] transition-all transform active:scale-95 shadow-[0_10px_20px_rgba(46,125,50,0.2)]'
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PopularDishes
