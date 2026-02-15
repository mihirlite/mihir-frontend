import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category, searchQuery }) => {

    const { food_list, vegOnly, nonVegOnly } = useContext(StoreContext)
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

    return (
        <div className='mt-8 md:mt-16' id='food-display'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 md:mb-12'>
                <div className='text-center md:text-left'>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="w-8 h-1 bg-orange-500 rounded-full hidden md:block"></span>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#323232] tracking-tight'>Top dishes for you</h2>
                    </div>
                    {searchQuery && (
                        <p className='text-orange-500 font-semibold mt-1 text-sm md:text-base animate-fadeIn'>
                            Showing results for "<span className="italic">{searchQuery}</span>"
                        </p>
                    )}
                </div>
                {filteredList.length > 0 && (
                    <p className='text-orange-600 font-bold bg-orange-50 px-6 py-2 rounded-full text-xs md:text-sm self-center md:self-auto border border-orange-100 shadow-sm'>
                        {filteredList.length} dishes found
                    </p>
                )}
            </div>

            {filteredList.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 row-gap-10 md:row-gap-12 pb-8">
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
                        <div className='flex justify-center mt-12 md:mt-16'>
                            <button
                                onClick={loadMore}
                                className='group relative bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold py-3 px-10 rounded-full text-base md:text-lg shadow-lg hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0 overflow-hidden'
                            >
                                <span className="relative z-10">Load More Dishes</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className='flex flex-col items-center justify-center py-24 text-center animate-fadeIn bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mx-4'>
                    <div className='text-7xl mb-6 opacity-80'>🍽️</div>
                    <h3 className='text-2xl md:text-3xl font-bold text-gray-800 mb-3'>No dishes found</h3>
                    <p className='text-gray-500 max-w-md mx-auto px-4'>
                        We couldn't find any dishes matching "{searchQuery}". Try adjusting your filters or search for something else!
                    </p>
                    <button
                        onClick={() => {
                            // Optional: Reset search or categories logic could go here if props allowed
                        }}
                        className='mt-8 text-orange-500 font-bold hover:underline'
                    >
                        View all dishes
                    </button>
                </div>
            )}
        </div>
    )
}

export default FoodDisplay
