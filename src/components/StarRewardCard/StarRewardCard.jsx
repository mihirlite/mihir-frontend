import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const TOTAL_STARS = 12;

const StarRewardCard = () => {
    const { url, token } = useContext(StoreContext);
    const [rewardData, setRewardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(false);

    const fetchRewardStatus = async () => {
        try {
            const response = await axios.post(url + '/api/reward/status', {}, { headers: { token } });
            if (response.data.success) {
                setRewardData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching reward status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        setRedeeming(true);
        try {
            const response = await axios.post(url + '/api/reward/redeem', {}, { headers: { token } });
            if (response.data.success) {
                toast.success('🎉 Free meal redeemed! Show this to the restaurant.');
                fetchRewardStatus();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error redeeming reward');
        } finally {
            setRedeeming(false);
        }
    };

    useEffect(() => {
        if (token) fetchRewardStatus();
    }, [token]);

    if (loading || !rewardData) return null;

    const { stars, freeRewardAvailable } = rewardData;
    const progress = Math.min(stars, TOTAL_STARS);
    const progressPercent = (progress / TOTAL_STARS) * 100;

    return (
        <div className={`relative overflow-hidden rounded-[2.5rem] p-6 md:p-8 mb-10 border transition-all duration-500 ${freeRewardAvailable
            ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 border-orange-300 shadow-2xl shadow-orange-200'
            : 'bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-gray-800 shadow-xl'
        }`}>
            {/* Decorative blobs */}
            <div className='absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -ml-10 -mb-10 blur-xl'></div>

            <div className='relative z-10'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
                    <div className='flex items-center gap-3'>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${freeRewardAvailable ? 'bg-white/30' : 'bg-orange-500/20'}`}>
                            {freeRewardAvailable ? '🏆' : '⭐'}
                        </div>
                        <div>
                            <h3 className={`font-black text-lg leading-tight ${freeRewardAvailable ? 'text-white' : 'text-white'}`}>
                                {freeRewardAvailable ? 'Free Meal Unlocked!' : 'Star Rewards'}
                            </h3>
                            <p className={`text-xs font-medium ${freeRewardAvailable ? 'text-white/80' : 'text-gray-400'}`}>
                                {freeRewardAvailable
                                    ? 'Congratulations! You\'ve earned a free meal 🎉'
                                    : `Earn ${TOTAL_STARS - stars} more star${TOTAL_STARS - stars === 1 ? '' : 's'} for a FREE meal!`}
                            </p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl font-black text-sm ${freeRewardAvailable ? 'bg-white/25 text-white' : 'bg-orange-500/20 text-orange-400'}`}>
                        {freeRewardAvailable ? '🎁 Ready!' : `${stars} / ${TOTAL_STARS} Stars`}
                    </div>
                </div>

                {/* Star Grid */}
                <div className='grid grid-cols-6 gap-2 sm:gap-3 mb-6'>
                    {Array.from({ length: TOTAL_STARS }).map((_, i) => {
                        const filled = i < stars;
                        return (
                            <div
                                key={i}
                                className={`aspect-square rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all duration-300 ${filled
                                    ? freeRewardAvailable
                                        ? 'bg-white/30 scale-105 shadow-lg'
                                        : 'bg-orange-500/30 scale-105 border border-orange-400/40'
                                    : 'bg-white/5 border border-white/10'
                                }`}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {filled ? '⭐' : <span className='opacity-20 text-sm'>☆</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                {!freeRewardAvailable && (
                    <div className='mb-2'>
                        <div className='flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2'>
                            <span>Progress</span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className='w-full bg-white/10 rounded-full h-2.5 overflow-hidden'>
                            <div
                                className='h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-700 ease-out'
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Redeem Button */}
                {freeRewardAvailable && (
                    <button
                        onClick={handleRedeem}
                        disabled={redeeming}
                        className='w-full mt-2 py-4 bg-white text-orange-600 rounded-2xl font-black text-base tracking-wide hover:bg-orange-50 transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2'
                    >
                        {redeeming ? (
                            <div className='w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin'></div>
                        ) : '🎁'}
                        {redeeming ? 'Redeeming...' : 'Claim Free Meal'}
                    </button>
                )}

                <p className={`text-[10px] mt-3 text-center font-medium ${freeRewardAvailable ? 'text-white/60' : 'text-gray-500'}`}>
                    1 star per successful order • 12 stars = 1 free meal
                </p>
            </div>
        </div>
    );
};

export default StarRewardCard;
