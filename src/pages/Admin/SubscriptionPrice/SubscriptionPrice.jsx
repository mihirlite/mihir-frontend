import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdSave, MdDeleteOutline, MdSync } from 'react-icons/md';

const SubscriptionPrice = ({ url, token }) => {
    const [prices, setPrices] = useState([]);
    const [basePrices, setBasePrices] = useState({ vegThaliPrice: 0, nonVegThaliPrice: 0 });
    const [loading, setLoading] = useState(true);
    // Which row is currently being edited. If new, it will lack an _id.
    const [editingId, setEditingId] = useState(null);
    const [editingRow, setEditingRow] = useState(null);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const [pricesRes, baseRes] = await Promise.all([
                axios.get(`${url}/api/subscription/get`),
                axios.get(`${url}/api/subscription/get-base`)
            ]);

            if (pricesRes.data.success) {
                setPrices(pricesRes.data.data);
            } else {
                toast.error("Error fetching prices");
            }

            if (baseRes.data.success) {
                setBasePrices(baseRes.data.data);
            }

        } catch (error) {
            toast.error("Server Error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPrices();
    }, [url]);

    const handleSaveBasePrices = async () => {
        try {
            const response = await axios.post(`${url}/api/subscription/set-base`, basePrices, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchPrices();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error saving base prices");
        }
    };

    const handleAddRow = () => {
        if (editingId) {
            toast.warning("Please save or cancel your current edit before adding a new row.");
            return;
        }
        const newRow = { _id: 'new', plan: '15_days', mealTiming: 'Lunch', mealPreference: 'Veg', vegCount: 0, nonVegCount: 0, price: 0, discount: 0, message: '' };
        setPrices([{ ...newRow }, ...prices]);
        setEditingId('new');
        setEditingRow(newRow);
    };

    const handleEditClick = (priceItem) => {
        if (editingId && editingId !== priceItem._id) {
            toast.warning("Please save or cancel your current edit first.");
            return;
        }
        setEditingId(priceItem._id);
        setEditingRow({ ...priceItem, discount: priceItem.discount || 0 });
    };

    const handleCancelEdit = () => {
        if (editingId === 'new') {
            setPrices(prices.filter(p => p._id !== 'new'));
        }
        setEditingId(null);
        setEditingRow(null);
    };

    const handleSaveRow = async () => {
        try {
            const calculatedPrice = (Number(editingRow.vegCount || 0) * basePrices.vegThaliPrice) +
                (Number(editingRow.nonVegCount || 0) * basePrices.nonVegThaliPrice);

            const payload = { ...editingRow, price: calculatedPrice };
            if (payload._id === 'new') {
                delete payload._id; // Let mongo generate it
            }
            const response = await axios.post(`${url}/api/subscription/set`, payload, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setEditingId(null);
                setEditingRow(null);
                fetchPrices();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error saving price rule");
        }
    };

    const handleDeleteRow = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pricing rule?")) return;
        try {
            const response = await axios.post(`${url}/api/subscription/delete`, { id }, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                if (editingId === id) {
                    setEditingId(null);
                    setEditingRow(null);
                }
                fetchPrices();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error deleting rule");
        }
    };

    const handleChange = (e, field) => {
        setEditingRow(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto animate-fadeIn w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Subscription Pricing Matrix</h2>
                        <p className="text-gray-500 mt-2 font-medium">Define granular pricing rules for every allowed combination of subscription settings.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Base Prices Section */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Base Veg Thali Price (₹)</label>
                            <input
                                type="number"
                                value={basePrices.vegThaliPrice}
                                onChange={(e) => setBasePrices({ ...basePrices, vegThaliPrice: Number(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl font-black text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Base Non-Veg Thali Price (₹)</label>
                            <input
                                type="number"
                                value={basePrices.nonVegThaliPrice}
                                onChange={(e) => setBasePrices({ ...basePrices, nonVegThaliPrice: Number(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl font-black text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSaveBasePrices}
                            className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors h-[50px] flex items-center gap-2"
                        >
                            <MdSave /> Save Bases
                        </button>
                    </div>

                    {/* Table Description Section */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center bg-blue-50/50 p-6 border border-blue-100 rounded-2xl gap-4">
                        <p className="text-sm font-bold text-blue-800 flex-1 leading-relaxed max-w-2xl">The cart will dynamically look up these exact combinations. Ensure you cover all combinations you want users to buy.</p>
                        <button
                            onClick={handleAddRow}
                            disabled={!!editingId}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shrink-0
                                ${!!editingId ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'}
                            `}
                        >
                            <MdAdd size={20} /> Add Pricing Rule
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <MdSync className="text-gray-300 text-4xl animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm w-full">
                            <table className="w-full text-left bg-white min-w-[1300px]">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 min-w-[140px]">Plan Duration</th>
                                        <th className="px-6 py-4 min-w-[140px]">Meal Timing</th>
                                        <th className="px-6 py-4 min-w-[140px]">Meal Preference</th>
                                        <th className="px-6 py-4 min-w-[100px]">Veg Count</th>
                                        <th className="px-6 py-4 min-w-[100px]">Non-Veg</th>
                                        <th className="px-6 py-4 min-w-[100px]">Discount %</th>
                                        <th className="px-6 py-4 min-w-[200px]">Price Breakdown (₹)</th>
                                        <th className="px-6 py-4 w-48 min-w-[180px]">Cart Message</th>
                                        <th className="px-6 py-4 text-center min-w-[100px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {prices.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center text-gray-400 font-bold">
                                                No pricing rules defined. Add a rule to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        prices.map((priceItem) => {
                                            const isEditing = editingId === priceItem._id;
                                            const rowData = isEditing ? editingRow : priceItem;

                                            const basePrice = (Number(rowData.mealPreference !== 'Non-Veg' ? rowData.vegCount : 0) * basePrices.vegThaliPrice) +
                                                (Number(rowData.mealPreference !== 'Veg' ? rowData.nonVegCount : 0) * basePrices.nonVegThaliPrice);
                                            const discount = Number(rowData.discount || 0);
                                            const finalPrice = Math.max(0, basePrice - (basePrice * discount / 100));

                                            return (
                                                <tr key={priceItem._id} className={`transition-colors text-sm ${isEditing ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                                                    {/* Plan */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <select value={rowData.plan} onChange={(e) => handleChange(e, 'plan')} className="w-full p-2 border border-blue-200 rounded-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none">
                                                                <option value="15_days">15 Days Sub</option>
                                                                <option value="30_days">30 Days Sub</option>
                                                            </select>
                                                        ) : (
                                                            <span className="font-bold text-gray-800">{rowData.plan === '15_days' ? '15 Days Sub' : '30 Days Sub'}</span>
                                                        )}
                                                    </td>

                                                    {/* Meal Timing */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <select value={rowData.mealTiming} onChange={(e) => handleChange(e, 'mealTiming')} className="w-full p-2 border border-blue-200 rounded-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none">
                                                                <option value="Lunch">Lunch</option>
                                                                <option value="Dinner">Dinner</option>
                                                                <option value="Both">Both (L&D)</option>
                                                            </select>
                                                        ) : (
                                                            <span className="font-bold text-gray-800">{rowData.mealTiming === 'Both' ? 'Both (L&D)' : rowData.mealTiming}</span>
                                                        )}
                                                    </td>

                                                    {/* Meal Preference */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <select value={rowData.mealPreference} onChange={(e) => handleChange(e, 'mealPreference')} className="w-full p-2 border border-blue-200 rounded-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none">
                                                                <option value="Veg">Veg</option>
                                                                <option value="Non-Veg">Non-Veg</option>
                                                                <option value="Both">Both (Mix)</option>
                                                            </select>
                                                        ) : (
                                                            <span className="font-bold text-gray-800">{rowData.mealPreference === 'Both' ? 'Both (Mix)' : rowData.mealPreference}</span>
                                                        )}
                                                    </td>

                                                    {/* Veg Count */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                value={rowData.vegCount}
                                                                onChange={(e) => handleChange(e, 'vegCount')}
                                                                className={`w-16 p-2 border rounded-lg font-black outline-none ${rowData.mealPreference === 'Non-Veg' ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-blue-300 text-green-700 focus:ring-2 focus:ring-blue-500'}`}
                                                                min="0"
                                                                disabled={rowData.mealPreference === 'Non-Veg'}
                                                            />
                                                        ) : (
                                                            <span className={`font-black px-3 py-1 rounded-full ${rowData.mealPreference === 'Non-Veg' ? 'text-gray-400' : 'text-green-700 bg-green-50'}`}>
                                                                {rowData.mealPreference === 'Non-Veg' ? '-' : (rowData.vegCount || 0)}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Non-Veg Count */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                value={rowData.nonVegCount}
                                                                onChange={(e) => handleChange(e, 'nonVegCount')}
                                                                className={`w-16 p-2 border rounded-lg font-black outline-none ${rowData.mealPreference === 'Veg' ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-blue-300 text-red-700 focus:ring-2 focus:ring-blue-500'}`}
                                                                min="0"
                                                                disabled={rowData.mealPreference === 'Veg'}
                                                            />
                                                        ) : (
                                                            <span className={`font-black px-3 py-1 rounded-full ${rowData.mealPreference === 'Veg' ? 'text-gray-400' : 'text-red-700 bg-red-50'}`}>
                                                                {rowData.mealPreference === 'Veg' ? '-' : (rowData.nonVegCount || 0)}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Discount */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                value={rowData.discount}
                                                                onChange={(e) => handleChange(e, 'discount')}
                                                                className="w-16 p-2 border border-orange-300 rounded-lg font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-500"
                                                                min="0"
                                                                max="100"
                                                            />
                                                        ) : (
                                                            <span className={`font-black px-3 py-1 rounded-full ${discount > 0 ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}>
                                                                {discount > 0 ? `${discount}%` : '-'}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Price Breakdown */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            {discount > 0 ? (
                                                                <>
                                                                    <span className="text-[10px] text-gray-400 font-bold line-through">₹{basePrice.toFixed(0)}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">₹{finalPrice.toFixed(0)}</span>
                                                                        <span className="text-[10px] text-orange-500 font-black uppercase">-{discount}% OFF</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">₹{basePrice.toFixed(0)}</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Message */}
                                                    <td className="px-6 py-4">
                                                        {isEditing ? (
                                                            <input type="text" value={rowData.message} onChange={(e) => handleChange(e, 'message')} className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="Cart message..." />
                                                        ) : (
                                                            <span className="text-[12px] text-gray-500 font-bold italic truncate block max-w-[150px]">{rowData.message || "-"}</span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 text-center">
                                                        {isEditing ? (
                                                            <div className="flex justify-center gap-2">
                                                                <button onClick={handleSaveRow} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 rounded-lg transition-colors" title="Save Rule">
                                                                    <MdSave size={20} />
                                                                </button>
                                                                <button onClick={handleCancelEdit} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors text-xs font-bold px-3">
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-center gap-2">
                                                                <button onClick={() => handleEditClick(priceItem)} className="p-2 text-blue-500 font-bold hover:bg-blue-50 rounded-lg transition-colors text-sm" disabled={!!editingId} title="Edit Rule">
                                                                    Edit
                                                                </button>
                                                                <button onClick={() => handleDeleteRow(priceItem._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" disabled={!!editingId} title="Delete Rule">
                                                                    <MdDeleteOutline size={22} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPrice;
