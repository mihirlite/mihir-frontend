import React from 'react';
import { HiOutlineSearch, HiOutlineMicrophone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const StickySearch = ({ searchQuery, setSearchQuery }) => {
    const navigate = useNavigate();

    return (
        <div className="sticky top-[70px] sm:top-[80px] z-[900] bg-white/90 backdrop-blur-md py-3 px-4 sm:px-6 shadow-sm border-b border-gray-100">
            <div className="max-w-[1280px] mx-auto flex justify-center">
                <div className="flex items-center gap-3 bg-white w-full max-w-2xl px-4 py-3 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-gray-100 focus-within:border-orange-500/50 focus-within:shadow-[0_4px_20px_rgba(255,107,0,0.15)] transition-all">
                    <HiOutlineSearch size={22} className="text-orange-500" />
                    <input
                        type="text"
                        placeholder="Search meals, thalis, chicken, fish..."
                        value={searchQuery}
                        onChange={(e) => { 
                            setSearchQuery(e.target.value); 
                            if (window.location.pathname !== '/') navigate('/'); 
                        }}
                        className="bg-transparent outline-none flex-1 font-medium text-gray-800 placeholder-gray-400 min-w-0"
                    />
                    <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
                    <HiOutlineMicrophone size={22} className="text-orange-500 cursor-pointer hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default StickySearch;
