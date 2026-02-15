import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdSearch, MdArrowForward } from 'react-icons/md';

const Wishlist = () => {

    const { food_list, wishlistItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const wishlistCount = food_list.filter(item => wishlistItems[item._id]).length;

    return (
        <div className='max-w-[1280px] mx-auto px-4 pt-28 pb-20 animate-fadeIn'>
            {wishlistCount === 0 ? (
                <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4'>
                    <div className='w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-6 drop-shadow-xl'>
                        <MdFavorite size={48} />
                    </div>
                    <h2 className='text-3xl font-black text-gray-800 mb-2'>Your wishlist is empty</h2>
                    <p className='text-gray-500 mb-8 max-w-sm'>You haven't saved any dishes yet. Start exploring and save your favorites!</p>
                    <button
                        onClick={() => navigate('/#menu')}
                        className='px-10 py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center gap-2'
                    >
                        Explore Menu <MdArrowForward size={20} />
                    </button>
                </div>
            ) : (
                <>
                    <div className='flex items-center justify-between mb-10 border-b border-gray-100 pb-8'>
                        <div>
                            <div className='flex items-center gap-3 mb-1'>
                                <MdFavorite className='text-pink-500' size={24} />
                                <h1 className='text-3xl font-black text-gray-800 tracking-tight'>My Wishlist</h1>
                            </div>
                            <p className='text-gray-500 font-medium'>Saved items for your next delicious meal</p>
                        </div>
                        <div className='hidden sm:flex bg-pink-50 px-5 py-2 rounded-full border border-pink-100 items-center gap-2'>
                            <span className='w-2 h-2 bg-pink-500 rounded-full animate-pulse'></span>
                            <p className='text-pink-600 font-bold text-sm'>{wishlistCount} Saved Items</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {food_list.map((item, index) => {
                            if (wishlistItems[item._id]) {
                                return (
                                    <div
                                        key={index}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                        className='animate-fadeIn h-full'
                                    >
                                        <FoodItem
                                            id={item._id}
                                            name={item.name}
                                            description={item.description}
                                            price={item.price}
                                            image={item.image}
                                            veg={item.veg}
                                        />
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>

                    <div className='mt-16 bg-orange-50/50 p-8 rounded-[3rem] border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6'>
                        <div className='flex items-center gap-4 text-center md:text-left'>
                            <div className='w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0'>
                                <MdSearch size={28} />
                            </div>
                            <div>
                                <h3 className='text-lg font-black text-gray-800'>Hungry for something else?</h3>
                                <p className='text-sm text-gray-500 font-medium'>Explore our full menu for more amazing dishes.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/#menu')}
                            className='px-8 py-4 bg-white text-orange-600 rounded-2xl font-black border border-orange-100 hover:bg-orange-500 hover:text-white transition-all active:scale-95'
                        >
                            View Full Menu
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Wishlist
