import React, { useContext } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { StoreContext } from '../../context/StoreContext';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    const {
        vegOnly, setVegOnly,
        nonVegOnly, setNonVegOnly
    } = useContext(StoreContext);

    const clearFilters = () => {
        setSearchQuery("");
        setVegOnly(false);
        setNonVegOnly(false);
    }

    const isFilterActive = searchQuery !== "" || vegOnly || nonVegOnly;

    return (
        <div className='flex flex-col md:flex-row gap-6 items-center justify-between my-8 md:my-16 animate-fadeIn w-[90%] md:w-[85%] lg:w-[80%] m-auto'>
            {/* Search Input */}
            <div className='relative w-full md:flex-1'>
                <CiSearch className='absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400' />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search for dishes...'
                    className='w-full pl-14 pr-12 py-4 rounded-full border-2 border-gray-100 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-base md:text-lg shadow-sm bg-white placeholder-gray-400'
                />
                {searchQuery && (
                    <div
                        onClick={() => setSearchQuery("")}
                        className='absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors group'
                    >
                        <IoCloseOutline className='text-xl text-gray-400 group-hover:text-orange-500 transition-colors' />
                    </div>
                )}
            </div>

            {/* Filter Toggle Buttons */}
            <div className='flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0'>
                <button
                    onClick={() => {
                        setVegOnly(!vegOnly);
                        if (!vegOnly) setNonVegOnly(false);
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-bold whitespace-nowrap shadow-sm text-sm active:scale-95
                        ${vegOnly ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-100' : 'bg-white border-transparent hover:border-green-200 hover:bg-green-50 text-gray-600'}`}
                >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${vegOnly ? 'border-green-600 bg-green-600' : 'border-gray-400'}`}>
                        {vegOnly && <div className='w-1.5 h-1.5 rounded-full bg-white'></div>}
                    </div>
                    Pure Veg
                </button>

                <button
                    onClick={() => {
                        setNonVegOnly(!nonVegOnly);
                        if (!nonVegOnly) setVegOnly(false);
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all font-bold whitespace-nowrap shadow-sm text-sm active:scale-95
                        ${nonVegOnly ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-100' : 'bg-white border-transparent hover:border-red-200 hover:bg-red-50 text-gray-600'}`}
                >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${nonVegOnly ? 'border-red-600 bg-red-600' : 'border-gray-400'}`}>
                        {nonVegOnly && <div className='w-1.5 h-1.5 rounded-full bg-white'></div>}
                    </div>
                    Non-Veg
                </button>

                {isFilterActive && (
                    <button
                        onClick={clearFilters}
                        className='px-4 py-2 rounded-full text-sm font-bold text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all whitespace-nowrap ml-auto md:ml-0'
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchBar

