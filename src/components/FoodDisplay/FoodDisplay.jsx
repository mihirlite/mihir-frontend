import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { HiOutlineSearch, HiOutlineMicrophone } from 'react-icons/hi'

const categories = ["All", "Veg", "Non-Veg", "Fish", "Egg", "Special Combos"];

// ─── Horizontal Row (Mobile Only) ───────────────────────────────────────────
const MobileHorizontalRow = ({ title, emoji, accentColor, items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-8">
            {/* Row Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{emoji}</span>
                    <h3 className="text-[17px] font-extrabold text-gray-900 tracking-tight">{title}</h3>
                    <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: accentColor + '20', color: accentColor }}
                    >
                        {items.length}
                    </span>
                </div>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    scroll →
                </span>
            </div>

            {/* Horizontal Scroll Strip */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3 px-3 pb-2">
                {items.map((item, index) => (
                    <div
                        key={item._id || index}
                        className="flex-shrink-0 w-[160px] animate-fadeIn"
                        style={{ animationDelay: `${index * 40}ms` }}
                    >
                        <FoodItem
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            veg={item.veg}
                            inStock={item.inStock}
                            discount={item.discount}
                            rating={item.rating || 4.5}
                            reviewsCount={item.reviewsCount || 124}
                            compact={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const FoodDisplay = ({ searchQuery, setSearchQuery }) => {
    const { food_list } = useContext(StoreContext);
    const [displayCount, setDisplayCount] = useState(9);
    const [activeCategory, setActiveCategory] = useState("All");
    const [isListening, setIsListening] = useState(false);

    // ── Voice Search ──────────────────────────────────────────────────────
    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice search.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const clean = transcript.endsWith('.') ? transcript.slice(0, -1) : transcript;
            setSearchQuery(clean);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    // ── Filtered Base List ────────────────────────────────────────────────
    const baseList = (food_list || []).filter(item => {
        if (item.isComboAddon) return false;
        const matchesSearch = !searchQuery || item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesCategory = true;
        if (activeCategory === "Veg") {
            matchesCategory = item.veg;
        } else if (activeCategory === "Non-Veg") {
            matchesCategory = !item.veg;
        } else if (activeCategory !== "All") {
            matchesCategory = item.category === activeCategory ||
                item.name?.toLowerCase().includes(activeCategory.toLowerCase());
        }
        return matchesSearch && matchesCategory;
    });

    // ── Split for Mobile Rows ─────────────────────────────────────────────
    const vegItems    = baseList.filter(item => item.veg);
    const nonVegItems = baseList.filter(item => !item.veg);

    const loadMore = () => setDisplayCount(prev => prev + 6);

    // Whether we're in "All" tab and no search — show sectioned rows on mobile
    const showSectionedRows = activeCategory === "All" && !searchQuery;

    return (
        <div className='px-1 sm:px-0' id='food-display'>

            {/* ── Sticky Search Bar ─────────────────────────────────── */}
            <div className='sticky top-[72px] sm:top-[80px] z-40 bg-white/95 backdrop-blur-md py-3 mb-4 -mx-3 px-3 sm:mx-0 sm:px-0 border-b border-gray-100/50'>
                <div className='flex items-center bg-gray-100 rounded-full px-4 py-3 shadow-inner'>
                    <HiOutlineSearch size={22} className='text-gray-400 min-w-max' />
                    <input
                        type="text"
                        placeholder="Search meals, thalis, chicken, fish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-transparent outline-none flex-1 mx-3 text-sm font-medium text-gray-800 placeholder-gray-400 w-full'
                    />
                    <div
                        onClick={startVoiceSearch}
                        className={`p-1.5 rounded-full shadow-sm cursor-pointer transition-colors ${isListening ? 'bg-orange-100 animate-pulse' : 'bg-white hover:bg-orange-50'}`}
                    >
                        <HiOutlineMicrophone size={18} className='text-orange-500' />
                    </div>
                </div>
            </div>

            {/* ── Category Chips ────────────────────────────────────── */}
            <div className='flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-1 -mx-3 px-3 sm:mx-0 sm:px-0'>
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 border ${
                            activeCategory === cat
                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-orange-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── MOBILE: Sectioned Rows (only when "All" + no search) ─ */}
            {showSectionedRows ? (
                <>
                    {/* Mobile Rows (hidden on sm+) */}
                    <div className="block sm:hidden">
                        {baseList.length === 0 ? (
                            <EmptyState setSearchQuery={setSearchQuery} setActiveCategory={setActiveCategory} />
                        ) : (
                            <>
                                <MobileHorizontalRow
                                    title="Veg Specials 🌿"
                                    emoji="🥗"
                                    accentColor="#16a34a"
                                    items={vegItems}
                                />
                                <MobileHorizontalRow
                                    title="Non-Veg Favourites"
                                    emoji="🍗"
                                    accentColor="#FF6B00"
                                    items={nonVegItems}
                                />
                            </>
                        )}
                    </div>

                    {/* Desktop/Tablet Grid (hidden on mobile) */}
                    <div className="hidden sm:block">
                        <div className='mb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>{baseList.length} dishes to explore</h2>
                        </div>
                        {baseList.length > 0 ? (
                            <>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pb-6">
                                    {baseList.slice(0, displayCount).map((item, index) => (
                                        <div key={item._id || index} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                                            <FoodItem
                                                id={item._id}
                                                name={item.name}
                                                description={item.description}
                                                price={item.price}
                                                image={item.image}
                                                veg={item.veg}
                                                inStock={item.inStock}
                                                discount={item.discount}
                                                rating={item.rating || 4.5}
                                                reviewsCount={item.reviewsCount || 124}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {displayCount < baseList.length && (
                                    <div className='flex justify-center mt-4 md:mt-8'>
                                        <button onClick={loadMore} className='bg-white text-orange-600 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold py-2.5 px-10 rounded-full text-sm shadow-sm'>
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState setSearchQuery={setSearchQuery} setActiveCategory={setActiveCategory} />
                        )}
                    </div>
                </>
            ) : (
                /* ── Filtered Grid: used when searching or category selected ── */
                <>
                    <div className='mb-4'>
                        <h2 className='text-lg font-bold text-gray-800'>{baseList.length} dishes found</h2>
                    </div>
                    {baseList.length > 0 ? (
                        <>
                            {/* Mobile single-col, Tablet 2-col, Desktop 3-col */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pb-6">
                                {baseList.slice(0, displayCount).map((item, index) => (
                                    <div key={item._id || index} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                                        <FoodItem
                                            id={item._id}
                                            name={item.name}
                                            description={item.description}
                                            price={item.price}
                                            image={item.image}
                                            veg={item.veg}
                                            inStock={item.inStock}
                                            discount={item.discount}
                                            rating={item.rating || 4.5}
                                            reviewsCount={item.reviewsCount || 124}
                                        />
                                    </div>
                                ))}
                            </div>
                            {displayCount < baseList.length && (
                                <div className='flex justify-center mt-4 md:mt-8'>
                                    <button onClick={loadMore} className='w-full sm:w-auto bg-white text-orange-600 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full text-sm shadow-sm'>
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState setSearchQuery={setSearchQuery} setActiveCategory={setActiveCategory} />
                    )}
                </>
            )}
        </div>
    );
}

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ setSearchQuery, setActiveCategory }) => (
    <div className='flex flex-col items-center justify-center py-10 text-center animate-fadeIn'>
        <div className='text-4xl mb-4'>🍽️</div>
        <h3 className='text-xl font-bold text-gray-800 mb-2'>No dishes found</h3>
        <p className='text-gray-500 text-sm'>Try selecting a different category or refining your search.</p>
        <button
            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            className='mt-6 bg-[#FF6B00] text-white px-6 py-2 rounded-full font-bold text-sm shadow-md'
        >
            Reset All
        </button>
    </div>
);

export default FoodDisplay
