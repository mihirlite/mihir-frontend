import React from 'react'
import Header from '../../components/Header/Header'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import FeedbackSection from '../../components/FeedbackSection/FeedbackSection'

const Home = ({ searchQuery, setSearchQuery }) => {

    return (
        <div className='bg-white overflow-x-hidden'>
            {/* Hero Section */}
            <Header />

            <div className='max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8'>

                {/* Full Menu Section */}
                <div id='all-foods' className='mt-5 sm:mt-8 md:mt-12 animate-fadeIn'>
                    <FoodDisplay category="All" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>

                {/* Feedback Section */}
                <div className='animate-fadeIn'>
                    <FeedbackSection />
                </div>

                {/* Why Choose Us Section */}
                <div className='animate-fadeIn'>
                    <WhyChooseUs />
                </div>

            </div>
        </div>
    )
}

export default Home
