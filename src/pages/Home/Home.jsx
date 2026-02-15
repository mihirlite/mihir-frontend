import React from 'react'
import Header from '../../components/Header/Header'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import SearchBar from '../../components/SearchBar/SearchBar'
import VegNonVegCategories from '../../components/VegNonVegCategories/VegNonVegCategories'
import PopularItems from '../../components/PopularItems/PopularItems'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'

const Home = ({ searchQuery, setSearchQuery }) => {

    return (
        <div className='bg-white overflow-x-hidden'>
            {/* Main Header / Hero Section */}
            <Header />

            <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>

                {/* Search & Categories Section */}
                <div id='explore-menu' className='mt-12 md:mt-16 space-y-12 animate-fadeIn' style={{ animationDelay: '200ms' }}>
                    <div className='w-full max-w-[800px] mx-auto'>
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>

                    <div className='animate-fadeIn' style={{ animationDelay: '400ms' }}>
                        <VegNonVegCategories />
                    </div>
                </div>

                {/* Popular Items Showcase */}
                <div className='mt-20 md:mt-32 animate-fadeIn' style={{ animationDelay: '600ms' }}>
                    <div className='flex flex-col items-center md:items-start mb-12'>
                        <h2 className='text-3xl md:text-4xl font-black text-gray-800 tracking-tight text-center md:text-left'>
                            Trending Now
                        </h2>
                        <div className='w-20 h-1.5 bg-orange-500 rounded-full mt-3'></div>
                    </div>
                    <PopularItems searchQuery={searchQuery} />
                </div>

                {/* Full Menu Section */}
                <div id='all-foods' className='mt-24 md:mt-36 animate-fadeIn' style={{ animationDelay: '800ms' }}>
                    <div className='flex flex-col items-center md:items-start mb-12'>
                        <div className='flex items-center gap-3 mb-2'>
                            <span className='w-2 h-8 bg-green-500 rounded-full'></span>
                            <h2 className='text-3xl md:text-4xl font-black text-gray-800 tracking-tight'>
                                Our Full Menu
                            </h2>
                        </div>
                        <p className='text-gray-500 font-medium text-center md:text-left max-w-lg px-4 md:px-0'>
                            Explore our wide variety of dishes made with the freshest ingredients and authentic recipes.
                        </p>
                    </div>

                    <div className='relative'>
                        <FoodDisplay category="All" searchQuery={searchQuery} />
                    </div>
                </div>

                {/* Trust & Features Section */}
                <div className='mt-32 md:mt-48 mb-24 animate-fadeIn' style={{ animationDelay: '1000ms' }}>
                    <WhyChooseUs />
                </div>
            </div>
        </div>
    )
}

export default Home
