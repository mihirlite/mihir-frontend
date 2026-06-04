import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdStar, MdCardGiftcard, MdPerson } from 'react-icons/md';

const TOTAL_STARS = 12;

const Rewards = ({ url, token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(null);

    const fetchRewards = async () => {
        try {
            const response = await axios.post(`${url}/api/reward/admin/all`, {}, { headers: { token } });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching rewards:', error);
            toast.error('Failed to load reward data');
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async (userId, userName) => {
        setRedeeming(userId);
        try {
            const response = await axios.post(`${url}/api/reward/admin/redeem`, { userId }, { headers: { token } });
            if (response.data.success) {
                toast.success(`✅ Free meal redeemed for ${userName}!`);
                fetchRewards();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error redeeming reward');
        } finally {
            setRedeeming(null);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto animate-fadeIn'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-8'>
                <div className='p-3 bg-yellow-100 text-yellow-600 rounded-2xl'>
                    <MdStar size={30} />
                </div>
                <div>
                    <h2 className='text-2xl md:text-3xl font-black text-[#323232]'>Reward Management</h2>
                    <p className='text-gray-500 font-medium'>Track and redeem customer star rewards</p>
                </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8'>
                <div className='bg-white p-5 rounded-3xl border border-gray-100 shadow-sm'>
                    <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-1'>Total Earning</p>
                    <p className='text-3xl font-black text-[#323232]'>{users.length}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>Customers with stars</p>
                </div>
                <div className='bg-white p-5 rounded-3xl border border-gray-100 shadow-sm'>
                    <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-1'>Pending Rewards</p>
                    <p className='text-3xl font-black text-orange-500'>{users.filter(u => u.freeRewardAvailable).length}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>Free meals to redeem</p>
                </div>
                <div className='bg-white p-5 rounded-3xl border border-gray-100 shadow-sm col-span-2 sm:col-span-1'>
                    <p className='text-xs font-black text-gray-400 uppercase tracking-widest mb-1'>Stars Threshold</p>
                    <p className='text-3xl font-black text-[#323232]'>{TOTAL_STARS}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>Stars for 1 free meal</p>
                </div>
            </div>

            {/* Users List */}
            {users.length === 0 ? (
                <div className='text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200'>
                    <MdStar className='mx-auto text-6xl text-gray-200 mb-4' />
                    <p className='text-gray-400 font-bold'>No customers have earned stars yet</p>
                    <p className='text-gray-300 text-sm mt-1'>Stars are awarded on each successful payment</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {users.map(user => {
                        const progress = Math.min(user.stars || 0, TOTAL_STARS);
                        const progressPercent = (progress / TOTAL_STARS) * 100;
                        return (
                            <div key={user._id} className={`bg-white rounded-3xl p-6 border transition-all ${user.freeRewardAvailable ? 'border-orange-200 shadow-lg shadow-orange-50' : 'border-gray-100 shadow-sm'}`}>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                                    {/* User Info */}
                                    <div className='flex items-center gap-3 flex-1'>
                                        <div className='w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500'>
                                            <MdPerson size={24} />
                                        </div>
                                        <div>
                                            <p className='font-black text-gray-800'>{user.name}</p>
                                            <p className='text-xs text-gray-400 font-medium'>{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Stars display */}
                                    <div className='flex-1'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <div className='flex gap-1'>
                                                {Array.from({ length: TOTAL_STARS }).map((_, i) => (
                                                    <span key={i} className={`text-base transition-all ${i < (user.stars || 0) ? 'opacity-100' : 'opacity-15'}`}>
                                                        {i < (user.stars || 0) ? '⭐' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className='text-xs font-black text-gray-500 ml-2 whitespace-nowrap'>
                                                {user.stars || 0}/{TOTAL_STARS}
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-100 rounded-full h-2 overflow-hidden'>
                                            <div
                                                className='h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500'
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Redeem Button */}
                                    <div className='sm:w-40 shrink-0'>
                                        {user.freeRewardAvailable ? (
                                            <button
                                                onClick={() => handleRedeem(user._id, user.name)}
                                                disabled={redeeming === user._id}
                                                className='w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-sm hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2'
                                            >
                                                {redeeming === user._id ? (
                                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                ) : (
                                                    <MdCardGiftcard size={18} />
                                                )}
                                                {redeeming === user._id ? 'Redeeming...' : 'Redeem'}
                                            </button>
                                        ) : (
                                            <div className='w-full py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm text-center border border-gray-100'>
                                                {TOTAL_STARS - (user.stars || 0)} more needed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Rewards;
