import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const PopularItems = ({ searchQuery = "" }) => {
    const { food_list, vegOnly, nonVegOnly } = useContext(StoreContext);

    // Pick top items based on all active filters
    const popular_list = food_list
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVeg = !vegOnly || item.veg;
            const matchesNonVeg = !nonVegOnly || !item.veg;
            return matchesSearch && matchesVeg && matchesNonVeg;
        })
        .slice(0, 6);

    if (popular_list.length === 0) return null;

    return (
        <div className='my-12 md:my-24 w-full px-4 sm:px-6 md:w-[85%] lg:w-[80%] m-auto animate-fadeIn' id='popular-items'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 border-b pb-4 border-gray-200'>
                <div>
                    <h2 className='text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black text-[#323232] mb-1 tracking-tight'>Most Ordered Dishes</h2>
                    <p className='text-gray-500 text-sm md:text-base lg:text-lg font-medium'>Customer Favorites & Top Picks</p>
                </div>
                <button
                    onClick={() => document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })}
                    className='group flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-all py-2 px-4 rounded-full hover:bg-orange-50 active:scale-95'
                >
                    View Full Menu
                    <span className='group-hover:translate-x-1 transition-transform'>→</span>
                </button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10'>
                {popular_list.map((item, index) => (
                    <div key={index} className="animate-scaleIn" style={{ animationDelay: `${index * 0.1}s` }}>
                        <FoodItem
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            veg={item.veg}
                            inStock={item.inStock}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopularItems
