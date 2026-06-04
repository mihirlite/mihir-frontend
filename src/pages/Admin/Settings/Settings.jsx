import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdSettings, MdLanguage, MdAccessTime, MdSave, MdCampaign } from "react-icons/md"

const Settings = ({ url, token }) => {
    const [settings, setSettings] = useState({
        isWebsiteOff: false,
        deliveryTime: "30-40 min",
        onlineFrom: "00:00",
        onlineTo: "23:59",
        heroHeadline: "",
        heroSubHeadline: "",
        heroPriceHighlight: "",
        firstOrderOfferEnabled: true,
        firstOrderDiscountPercentage: 50,
        firstOrderMaxDiscount: 100,
        firstOrderMinOrderValue: 150
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${url}/api/settings/get`);
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setFetching(false);
        }
    }

    const updateSettings = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/settings/update`, settings, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSettings();
    }, []);

    if (fetching) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto animate-fadeIn'>
            <div className='flex items-center gap-4 mb-8'>
                <div className='p-3 bg-orange-100 text-orange-600 rounded-2xl'>
                    <MdSettings size={30} />
                </div>
                <div>
                    <h2 className='text-2xl md:text-3xl font-black text-[#323232]'>General Settings</h2>
                    <p className='text-gray-500 font-medium'>Manage your website status and delivery configuration</p>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Website Status Card */}
                <div className='bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-blue-50 text-blue-500 rounded-lg'>
                            <MdLanguage size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800'>Website Status</h3>
                    </div>
                    
                    <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                        <div>
                            <p className='font-bold text-gray-800'>
                                {settings.isWebsiteOff ? "Website is Offline" : "Website is Online"}
                            </p>
                            <p className='text-xs text-gray-500 mt-0.5'>
                                {settings.isWebsiteOff 
                                    ? "Users will see a maintenance page" 
                                    : "Users can browse and place orders"}
                            </p>
                        </div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input 
                                type="checkbox" 
                                checked={!settings.isWebsiteOff} 
                                onChange={() => setSettings(prev => ({ ...prev, isWebsiteOff: !prev.isWebsiteOff }))}
                                className='sr-only peer' 
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>

                {/* Scheduled Availability Card */}
                <div className='bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all md:col-span-2'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-purple-50 text-purple-600 rounded-lg'>
                            <MdAccessTime size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800'>Scheduled Availability</h3>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10'>
                        {/* Overall Website Schedule */}
                        <div className='col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-50'>
                            <div className='col-span-2 mb-2'>
                                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest'>Overall Website Schedule</h4>
                            </div>
                            <div>
                                <label className='block text-xs font-black text-gray-500 mb-2 ml-1 uppercase'>Online From</label>
                                <input 
                                    type="time" 
                                    value={settings.onlineFrom}
                                    onChange={(e) => setSettings(prev => ({ ...prev, onlineFrom: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-black text-gray-500 mb-2 ml-1 uppercase'>Online To</label>
                                <input 
                                    type="time" 
                                    value={settings.onlineTo}
                                    onChange={(e) => setSettings(prev => ({ ...prev, onlineTo: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                        </div>

                        {/* Lunch Order Timing */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='col-span-2 mb-2 flex items-center gap-2'>
                                <span className='text-xl'>🌞</span>
                                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest'>Lunch Order Timing</h4>
                            </div>
                            <div>
                                <label className='block text-xs font-black text-gray-500 mb-2 ml-1 uppercase'>Starts At</label>
                                <input 
                                    type="time" 
                                    value={settings.lunchStartTime || "10:00"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, lunchStartTime: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-black text-gray-500 mb-2 ml-1 uppercase'>Ends At</label>
                                <input 
                                    type="time" 
                                    value={settings.lunchEndTime || "12:00"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, lunchEndTime: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                        </div>

                        {/* Dinner Order Timing */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='col-span-2 mb-2 flex items-center gap-2'>
                                <span className='text-xl'>🌙</span>
                                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest'>Dinner Order Timing</h4>
                            </div>
                            <div>
                                <label className='block text-xs font-black text-gray-500 mb-2 ml-1 uppercase'>Starts At</label>
                                <input 
                                    type="time" 
                                    value={settings.dinnerStartTime || "18:00"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, dinnerStartTime: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-black text-gray-500 mb-2 ml-1 uppercase'>Ends At</label>
                                <input 
                                    type="time" 
                                    value={settings.dinnerEndTime || "20:00"}
                                    onChange={(e) => setSettings(prev => ({ ...prev, dinnerEndTime: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                        </div>
                    </div>
                    <p className='text-[10px] text-gray-400 mt-6 ml-1'>The website schedule controls overall access, while Lunch/Dinner timings specifically control ordering slots for Today Orders.</p>
                </div>

                {/* Hero Branding Section */}
                <div className='bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all md:col-span-2'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-orange-50 text-orange-600 rounded-lg'>
                            <MdCampaign size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800'>Hero Branding</h3>
                    </div>

                    <div className='grid grid-cols-1 gap-6'>
                        <div>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Headline</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 👉 Fresh Bengali & Odia Thali"
                                value={settings.heroHeadline}
                                onChange={(e) => setSettings(prev => ({ ...prev, heroHeadline: e.target.value }))}
                                className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-bold text-gray-800'
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Price Highlight</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Under ₹100"
                                    value={settings.heroPriceHighlight}
                                    onChange={(e) => setSettings(prev => ({ ...prev, heroPriceHighlight: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Sub-Headline</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 👉 Ghar jaisa khana, daily fresh..."
                                    value={settings.heroSubHeadline}
                                    onChange={(e) => setSettings(prev => ({ ...prev, heroSubHeadline: e.target.value }))}
                                    className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-bold text-gray-800'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* First Order Offer Section */}
                <div className='bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all md:col-span-2'>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='p-2 bg-green-50 text-green-500 rounded-lg'>
                            <MdSettings size={24} />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800'>First Order Offer Configuration (FIRST50)</h3>
                    </div>
                    
                    <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6'>
                        <div>
                            <p className='font-bold text-gray-800'>
                                {settings.firstOrderOfferEnabled ? "First Order Offer is Active" : "First Order Offer is Disabled"}
                            </p>
                            <p className='text-xs text-gray-500 mt-0.5'>
                                When active, eligible users can use code FIRST50
                            </p>
                        </div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input 
                                type="checkbox" 
                                checked={settings.firstOrderOfferEnabled} 
                                onChange={(e) => setSettings(prev => ({ ...prev, firstOrderOfferEnabled: e.target.checked }))}
                                className='sr-only peer' 
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Discount Percentage (%)</label>
                            <input 
                                type="number" 
                                value={settings.firstOrderDiscountPercentage}
                                onChange={(e) => setSettings(prev => ({ ...prev, firstOrderDiscountPercentage: Number(e.target.value) }))}
                                className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Max Discount (₹)</label>
                            <input 
                                type="number" 
                                value={settings.firstOrderMaxDiscount}
                                onChange={(e) => setSettings(prev => ({ ...prev, firstOrderMaxDiscount: Number(e.target.value) }))}
                                className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Min Order Value (₹)</label>
                            <input 
                                type="number" 
                                value={settings.firstOrderMinOrderValue}
                                onChange={(e) => setSettings(prev => ({ ...prev, firstOrderMinOrderValue: Number(e.target.value) }))}
                                className='w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-10 flex justify-end'>
                <button
                    onClick={updateSettings}
                    disabled={loading}
                    className='group flex items-center gap-3 bg-[#323232] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-500 transition-all active:scale-95 shadow-xl hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? (
                        <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    ) : (
                        <MdSave size={24} />
                    )}
                    <span>Save Settings</span>
                </button>
            </div>
        </div>
    )
}

export default Settings
