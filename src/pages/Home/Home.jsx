import React, { useContext } from 'react'
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
            
            {/* Search and Food Display Section */}
            <div className={`max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 ${generalSettings?.firstOrderOfferEnabled ? "pt-4" : "pt-[72px] sm:pt-[88px]"}`}>

                {/* {!searchQuery && <ComboSection />} */}
                
                {/* Full Menu Section */}
                <div id='all-foods' className='mt-2 sm:mt-4 md:mt-8 scroll-mt-24 sm:scroll-mt-32 animate-fadeIn'>
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
