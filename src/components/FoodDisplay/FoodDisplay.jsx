import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { HiOutlineSearch, HiOutlineMicrophone } from 'react-icons/hi'

const categories = ["All", "Veg", "Non-Veg", "Fish", "Egg", "Special Combos"];

const FoodDisplay = ({ searchQuery, setSearchQuery }) => {
    const { food_list } = useContext(StoreContext);
    const [displayCount, setDisplayCount] = useState(8);
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredList = (food_list || []).filter(item => {
        if (item.isComboAddon) return false;
        
        // Search filter
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        
        // Category filter
        let matchesCategory = true;
        if (activeCategory === "Veg") {
            matchesCategory = item.veg;
        } else if (activeCategory === "Non-Veg") {
            matchesCategory = !item.veg;
        } else if (activeCategory !== "All") {
            // Match exactly with the item category if it's not All/Veg/Non-Veg
            // For robust fallback, check if name includes the category if it doesn't match standard category
            matchesCategory = item.category === activeCategory || item.name?.toLowerCase().includes(activeCategory.toLowerCase());
        }

        return matchesSearch && matchesCategory;
    });

    const loadMore = () => {
        setDisplayCount(prev => prev + 4);
    }

    return (
        <div className='px-1 sm:px-0' id='food-display'>
            
            {/* Sticky Search Bar Section */}
            <div className='sticky top-[56px] sm:top-[64px] z-40 bg-white/95 backdrop-blur-md py-3 mb-4 -mx-3 px-3 sm:mx-0 sm:px-0 border-b border-gray-100/50'>
                <div className='flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-inner'>
                    <HiOutlineSearch size={22} className='text-gray-400 min-w-max' />
                    <input 
                        type="text"
                        placeholder="Search meals, thalis, chicken, fish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-transparent outline-none flex-1 mx-3 text-sm font-medium text-gray-800 placeholder-gray-400 w-full'
                    />
                    <div className='bg-white p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-orange-50 transition-colors'>
                        <HiOutlineMicrophone size={18} className='text-orange-500' />
                    </div>
                </div>
            </div>

            {/* Category Chips (Horizontal Scroll) */}
            <div className='flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2 -mx-3 px-3 sm:mx-0 sm:px-0'>
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 border ${
                            activeCategory === cat 
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Count Badge */}
            <div className='mb-4'>
                <h2 className='text-lg font-bold text-gray-800'>
                    {filteredList.length} dishes to explore
                </h2>
            </div>

            {/* Food Grid */}
            {filteredList.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pb-6">
                        {filteredList.slice(0, displayCount).map((item, index) => (
                            <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                                <FoodItem
                                    id={item._id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    image={item.image}
                                    veg={item.veg}
                                    inStock={item.inStock}
                                    discount={item.discount}
                                    rating={item.rating || 4.5} // Using mock rating for UI since real one isn't in original component
                                    reviewsCount={item.reviewsCount || 124}
                                />
                            </div>
                        ))}
                    </div>
                    {displayCount < filteredList.length && (
                        <div className='flex justify-center mt-4 md:mt-8'>
                            <button
                                onClick={loadMore}
                                className='w-full sm:w-auto bg-white text-orange-600 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full text-sm shadow-sm'
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className='flex flex-col items-center justify-center py-10 text-center animate-fadeIn'>
                    <div className='text-4xl mb-4'>🍽️</div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>No dishes found</h3>
                    <p className='text-gray-500 text-sm'>Try selecting a different category or refining your search.</p>
                    <button
                        onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
                        className='mt-6 bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md'
                    >
                        Reset All
                    </button>
                </div>
            )}
        </div>
    )
}

export default FoodDisplay
