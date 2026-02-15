import React from 'react'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className='flex flex-col gap-6 md:gap-8 pt-12 md:pt-16 pb-8 animate-fadeIn' id='explore-menu'>
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                <div className='max-w-2xl'>
                    <div className='flex items-center gap-3 mb-2'>
                        <span className='w-2 h-8 bg-orange-500 rounded-full'></span>
                        <h1 className='text-gray-800 font-extrabold text-3xl md:text-4xl tracking-tight'>Explore our menu</h1>
                    </div>
                    <p className='text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-full md:max-w-[80%]'>
                        Dive into our diverse collection of flavors. From sizzling appetizers to decadent desserts, our mission is to satisfy your cravings and elevate every meal into a memorable experience.
                    </p>
                </div>
                <div className='hidden lg:flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 text-orange-600 font-bold text-sm whitespace-nowrap'>
                    <span className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></span>
                    Select a category to filter
                </div>
            </div>

            <div className="flex items-center gap-6 md:gap-8 py-6 overflow-x-auto no-scrollbar scroll-smooth px-2 -mx-2">
                {menu_list.map((item, index) => {
                    const isActive = category === item.menu_name;
                    return (
                        <div
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                            key={index}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className='cursor-pointer flex-shrink-0 group flex flex-col items-center animate-fadeIn min-w-[80px] w-[20vw] max-w-[110px]'
                        >
                            <div className={`relative p-1 rounded-full transition-all duration-300 ${isActive ? "bg-orange-500 shadow-lg shadow-orange-200" : "bg-transparent group-hover:bg-gray-100"}`}>
                                <div className={`aspect-square w-full rounded-full overflow-hidden border-2 bg-white ${isActive ? "border-white" : "border-gray-50"}`}>
                                    <img
                                        className={`w-full h-full object-cover transition-all duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                                        src={item.menu_image}
                                        alt={item.menu_name}
                                    />
                                </div>
                                {isActive && (
                                    <div className='absolute -bottom-0 -right-0 w-6 h-6 bg-white rounded-full border-2 border-orange-500 flex items-center justify-center shadow-sm'>
                                        <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                                    </div>
                                )}
                            </div>
                            <p className={`mt-3 text-sm md:text-base font-bold text-center transition-all duration-300 ${isActive ? "text-orange-600" : "text-gray-500 group-hover:text-gray-800"}`}>
                                {item.menu_name}
                            </p>
                        </div>
                    )
                })}
            </div>

            <div className='h-[1px] bg-gradient-to-r from-orange-500/20 via-gray-100 to-transparent w-full mt-2'></div>
        </div>
    )
}

export default ExploreMenu
