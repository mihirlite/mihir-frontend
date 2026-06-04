import React, { useContext } from 'react'
import Header from '../../components/Header/Header'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
// import ComboSection from '../../components/ComboSection/ComboSection'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import FeedbackSection from '../../components/FeedbackSection/FeedbackSection'
import { StoreContext } from '../../context/StoreContext'
import { MdConfirmationNumber } from 'react-icons/md'

const Home = ({ searchQuery, setSearchQuery }) => {
    const { generalSettings } = useContext(StoreContext);

    return (
        <div className='bg-white overflow-x-hidden'>
            {generalSettings?.firstOrderOfferEnabled && (
                <div className='bg-green-500 text-white py-2 px-4 text-center shadow-md relative z-10 w-full mt-[88px] sm:mt-[104px] lg:mt-[120px]'>
                    <p className='text-[11px] sm:text-xs font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2'>
                        <MdConfirmationNumber size={16} />
                        Get 50% OFF on your first order! Use code: <span className="bg-white text-green-600 px-2 py-0.5 rounded-md shadow-sm">FIRST50</span>
                    </p>
                </div>
            )}
            
            {/* Hero Section */}
            <div className={generalSettings?.firstOrderOfferEnabled ? "" : "pt-[88px] sm:pt-[104px] lg:pt-[120px]"}>
                <Header />
            </div>

            <div className='max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8'>

                {/* {!searchQuery && <ComboSection />} */}
                
                {/* Full Menu Section */}
                <div id='all-foods' className='mt-8 sm:mt-12 md:mt-16 scroll-mt-24 sm:scroll-mt-32 animate-fadeIn'>
                    <div className='flex items-center gap-3 mb-8 md:mb-12'>
                        <span className='w-2 h-8 md:h-10 bg-orange-500 rounded-full'></span>
                        <h2 className='text-gray-800 font-extrabold text-2xl md:text-4xl tracking-tight uppercase'>
                            Explore our menu
                        </h2>
                    </div>
                    <FoodDisplay category="All" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>

                {/* Feedback Section */}
                <div className='animate-fadeIn'>
                    <FeedbackSection />
                </div>
            </div>

            {/* Why Choose Us — full-width dark section, outside the container */}
            <div className='animate-fadeIn'>
                <WhyChooseUs />
            </div>

        </div>
    )
}

export default Home
