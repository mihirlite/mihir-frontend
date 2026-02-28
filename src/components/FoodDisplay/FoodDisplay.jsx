import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, searchQuery, setSearchQuery }) => {

    const { food_list, vegOnly, setVegOnly, nonVegOnly, setNonVegOnly } = useContext(StoreContext)
    const [displayCount, setDisplayCount] = React.useState(8);

    const filteredList = food_list.filter(item => {
        const matchesCategory = category === "All" || category === item.category;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVeg = !vegOnly || item.veg;
        const matchesNonVeg = !nonVegOnly || !item.veg;
        return matchesCategory && matchesSearch && matchesVeg && matchesNonVeg;
    });

    const loadMore = () => {
        setDisplayCount(prev => prev + 4);
    }

    const handleVegClick = () => {
        if (vegOnly) { setVegOnly(false); }
        else { setVegOnly(true); setNonVegOnly(false); }
    }

    const handleNonVegClick = () => {
        if (nonVegOnly) { setNonVegOnly(false); }
        else { setNonVegOnly(true); setVegOnly(false); }
    }

    const clearFilters = () => {
        setVegOnly(false);
        setNonVegOnly(false);
    }

    return (
        <div className='px-1 sm:px-0' id='food-display'>
            {/* ── Title + Filters Row ── */}
            <div className='flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-6 md:mb-8'>

                {/* Heading */}
                <h2 className='text-lg sm:text-xl md:text-3xl font-extrabold text-[#323232] tracking-tight text-center sm:text-left whitespace-nowrap'>
                    Top dishes for you
                </h2>

                {/* Center: Filters */}
                <div className='flex items-center gap-2 flex-wrap justify-center'>
                    {/* Pure Veg */}
                    <button
                        onClick={handleVegClick}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 font-semibold text-xs sm:text-sm transition-all duration-200 ${vegOnly
                            ? 'border-green-500 bg-white text-green-600 shadow-md shadow-green-100'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-green-400'
                            }`}
                    >
                        <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-all ${vegOnly ? 'border-green-500' : 'border-gray-300'
                            }`}>
                            {vegOnly && <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 block'></span>}
                        </span>
                        Pure Veg
                    </button>

                    {/* Non-Veg */}
                    <button
                        onClick={handleNonVegClick}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 font-semibold text-xs sm:text-sm transition-all duration-200 ${nonVegOnly
                            ? 'border-red-500 bg-white text-red-600 shadow-md shadow-red-100'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-red-400'
                            }`}
                    >
                        <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-all ${nonVegOnly ? 'border-red-500' : 'border-gray-300'
                            }`}>
                            {nonVegOnly && <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 block'></span>}
                        </span>
                        Non-Veg
                    </button>

                    {/* Clear Filters */}
                    {(vegOnly || nonVegOnly) && (
                        <button
                            onClick={clearFilters}
                            className='text-xs sm:text-sm text-gray-400 font-semibold hover:text-red-500 transition-colors'
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Right: Count badge */}
                {filteredList.length > 0 && (
                    <span className='text-orange-600 font-bold bg-orange-50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs border border-orange-100 shadow-sm whitespace-nowrap'>
                        {filteredList.length} dishes found
                    </span>
                )}
            </div>


            {searchQuery && (
                <p className='text-orange-500 font-semibold text-sm md:text-base animate-fadeIn -mt-4 mb-6'>
                    Showing results for "<span className="italic">{searchQuery}</span>"
                </p>
            )}

            {filteredList.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 pb-6">
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
                                />
                            </div>
                        ))}
                    </div>
                    {displayCount < filteredList.length && (
                        <div className='flex justify-center mt-6 md:mt-10'>
                            <button
                                onClick={loadMore}
                                className='w-full sm:w-auto bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full text-sm sm:text-base md:text-lg shadow-lg hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0'
                            >
                                Load More Dishes
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className='flex flex-col items-center justify-center py-10 md:py-20 text-center animate-fadeIn bg-gray-50/50 backdrop-blur-sm rounded-[28px] md:rounded-[40px] border-2 border-dashed border-gray-100 px-4 sm:px-6'>
                    <div className='relative mb-8'>
                        <div className='w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-2 animate-bounce-slow'>
                            <span className='text-5xl'>🔍</span>
                        </div>
                        <div className='absolute -bottom-2 -right-2 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl shadow-lg'>
                            ❌
                        </div>
                    </div>

                    <h3 className='text-2xl md:text-4xl font-black text-[#323232] mb-4 tracking-tight'>
                        Ops! No Dishes Found
                    </h3>

                    <p className='text-gray-500 max-w-md mx-auto text-base md:text-lg mb-10 leading-relaxed font-medium'>
                        We couldn't find any results for matching <span className='text-orange-500 font-bold'>"{searchQuery}"</span>.
                        Try checking the spelling or use broader keywords.
                    </p>

                    <button
                        onClick={() => setSearchQuery("")}
                        className='bg-[#323232] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#ff7e00] transition-all transform active:scale-95 shadow-xl hover:shadow-orange-200 cursor-pointer'
                    >
                        Reset Search
                    </button>

                    <div className='mt-8 flex gap-4 text-xs md:text-sm font-bold text-gray-400'>
                        <span className='px-4 py-2 bg-white rounded-full shadow-sm'>Check filters</span>
                        <span className='px-4 py-2 bg-white rounded-full shadow-sm'>Try category: All</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FoodDisplay
