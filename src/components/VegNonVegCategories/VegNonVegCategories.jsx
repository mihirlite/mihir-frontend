import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'

const VegNonVegCategories = () => {
    const { vegOnly, setVegOnly, nonVegOnly, setNonVegOnly } = useContext(StoreContext);

    const handleVegClick = () => {
        setVegOnly(!vegOnly);
        setNonVegOnly(false);
        document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
    }

    const handleNonVegClick = () => {
        setNonVegOnly(!nonVegOnly);
        setVegOnly(false);
        document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className='flex flex-col md:flex-row gap-6 md:gap-10 my-16 md:my-20 animate-fadeIn w-[90%] md:w-[85%] lg:w-[80%] m-auto'>
            {/* Pure Veg Card */}
            <div
                onClick={handleVegClick}
                className={`relative group cursor-pointer overflow-hidden rounded-[2rem] flex-1 h-[280px] sm:h-[320px] md:h-[400px] transition-all duration-500 shadow-2xl hover:shadow-green-200/50 border-4 transform hover:-translate-y-2 ${vegOnly ? 'border-green-500 scale-[1.02] ring-4 ring-green-100' : 'border-transparent'}`}
            >
                <img
                    src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Pure Veg"
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${vegOnly ? 'opacity-90' : 'opacity-70 group-hover:opacity-80'}`}></div>

                {/* Content Overlay */}
                <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className={`w-6 h-6 rounded-md border-2 border-green-500 flex items-center justify-center bg-white ${vegOnly ? 'rotate-0' : 'rotate-45 group-hover:rotate-0 transition-transform duration-300'}`}>
                            <div className='w-2.5 h-2.5 rounded-full bg-green-500'></div>
                        </div>
                        <span className='text-green-400 font-bold tracking-[0.2em] text-xs uppercase'>Fresh & Healthy</span>
                    </div>

                    <h2 className='text-white text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 tracking-tight drop-shadow-lg'>
                        Pure Veg
                    </h2>

                    <p className='text-gray-200 text-sm md:text-base max-w-[90%] mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0 hidden sm:block leading-relaxed'>
                        Explore our curated selection of garden-fresh, nutrient-rich vegetarian delicacies.
                    </p>

                    <button className={`
                        px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform
                        ${vegOnly
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                            : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-green-500 hover:border-green-500 hover:shadow-lg'}
                    `}>
                        {vegOnly ? 'Selected ✓' : 'View Veg Menu →'}
                    </button>
                </div>

                {vegOnly && (
                    <div className='absolute top-6 right-6 bg-green-500 text-white p-2.5 rounded-full shadow-lg animate-bounce z-10'>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
            </div>

            {/* Non-Veg Specials Card */}
            <div
                onClick={handleNonVegClick}
                className={`relative group cursor-pointer overflow-hidden rounded-[2rem] flex-1 h-[280px] sm:h-[320px] md:h-[400px] transition-all duration-500 shadow-2xl hover:shadow-red-200/50 border-4 transform hover:-translate-y-2 ${nonVegOnly ? 'border-red-500 scale-[1.02] ring-4 ring-red-100' : 'border-transparent'}`}
            >
                <img
                    src="https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Non-Veg Specials"
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${nonVegOnly ? 'opacity-90' : 'opacity-70 group-hover:opacity-80'}`}></div>

                {/* Content Overlay */}
                <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className={`w-6 h-6 rounded-md border-2 border-red-500 flex items-center justify-center bg-white ${nonVegOnly ? 'rotate-0' : 'rotate-45 group-hover:rotate-0 transition-transform duration-300'}`}>
                            <div className='w-2.5 h-2.5 rounded-full bg-red-500'></div>
                        </div>
                        <span className='text-red-400 font-bold tracking-[0.2em] text-xs uppercase'>Juicy & Flavorful</span>
                    </div>

                    <h2 className='text-white text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 tracking-tight drop-shadow-lg'>
                        Non-Veg
                    </h2>

                    <p className='text-gray-200 text-sm md:text-base max-w-[90%] mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0 hidden sm:block leading-relaxed'>
                        Indulge in our premium range of succulent meats, savory masterpieces, and grill specials.
                    </p>

                    <button className={`
                        px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform
                        ${nonVegOnly
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                            : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-red-500 hover:border-red-500 hover:shadow-lg'}
                    `}>
                        {nonVegOnly ? 'Selected ✓' : 'View Non-Veg Menu →'}
                    </button>
                </div>

                {nonVegOnly && (
                    <div className='absolute top-6 right-6 bg-red-500 text-white p-2.5 rounded-full shadow-lg animate-bounce z-10'>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VegNonVegCategories
