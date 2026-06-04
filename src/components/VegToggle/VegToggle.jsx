import React from 'react'

const VegToggle = ({ vegOnly, setVegOnly }) => {
    return (
        <div className='flex items-center gap-4 my-6 ml-2 md:ml-6 group'>
            <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={() => setVegOnly(!vegOnly)}
                    className="sr-only peer"
                />

                {/* Track */}
                <div className={`
                    w-16 h-9 rounded-full peer 
                    bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-green-400 peer-checked:to-green-600
                    peer-focus:ring-4 peer-focus:ring-green-100
                    transition-all duration-500 ease-in-out shadow-inner
                `}></div>

                {/* Knob */}
                <div className={`
                    absolute left-[4px] top-[4px] bg-white w-7 h-7 rounded-full shadow-md 
                    transition-all duration-500 ease-in-out flex items-center justify-center
                    peer-checked:translate-x-full peer-checked:border-green-500
                `}>
                    {/* Icon inside knob */}
                    <div className={`transition-all duration-300 ${vegOnly ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 22s5-3 8-11c0 0-2 2-3 4"></path>
                            <path d="M7 2c0 0-1 4 8 11 0 0-1-6-8-11"></path>
                        </svg>
                    </div>
                </div>

                {/* Label */}
                <span className={`
                    ml-4 text-sm md:text-base font-bold tracking-wide transition-colors duration-300
                    ${vegOnly ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'}
                `}>
                    Veg Only
                </span>
            </label>
        </div>
    )
}

export default VegToggle
