import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdAdd, MdDelete, MdAccountBalanceWallet, MdSave, MdPercent } from "react-icons/md";

const GSTCharges = ({ url, token }) => {
    const [gstFixedAmount, setGstFixedAmount] = useState(0);
    const [isGstActive, setIsGstActive] = useState(true);
    const [chargesSlabs, setChargesSlabs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tempSlabs, setTempSlabs] = useState([]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(url + "/api/gst-charges/get");
            if (response.data.success) {
                setGstFixedAmount(response.data.data.gstFixedAmount);
                setIsGstActive(response.data.data.isGstActive ?? true);
                setChargesSlabs(response.data.data.chargesSlabs || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching GST & Charges settings");
        }
    }

    const saveSettings = async (finalGst, finalSlabs) => {
        try {
            const response = await axios.post(url + "/api/gst-charges/update",
                { gstFixedAmount: finalGst, isGstActive, chargesSlabs: finalSlabs },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                fetchSettings();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving settings");
        }
    }

    const handleGstSave = () => {
        saveSettings(gstFixedAmount, chargesSlabs);
    }

    const openModal = () => {
        setTempSlabs([...chargesSlabs]);
        setShowModal(true);
    }

    const addSlabRow = () => {
        setTempSlabs([...tempSlabs, { uptoAmount: "", charge: "" }]);
    }

    const removeSlabRow = (index) => {
        const newSlabs = tempSlabs.filter((_, i) => i !== index);
        setTempSlabs(newSlabs);
    }

    const handleSlabChange = (index, field, value) => {
        const newSlabs = [...tempSlabs];
        newSlabs[index][field] = value ? Number(value) : "";
        setTempSlabs(newSlabs);
    }

    const saveSlabs = () => {
        // Validation
        const isValid = tempSlabs.every(s => s.uptoAmount > 0 && s.charge >= 0);
        if (!isValid && tempSlabs.length > 0) {
            toast.error("Please provide valid values for all slabs");
            return;
        }

        const sorted = [...tempSlabs].sort((a, b) => a.uptoAmount - b.uptoAmount);
        setChargesSlabs(sorted);
        saveSettings(gstFixedAmount, sorted);
        setShowModal(false);
    }

    useEffect(() => {
        fetchSettings();
    }, [])

    return (
        <div className='animate-fadeIn flex flex-col gap-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>GST & Charges</h3>
                    <p className='text-sm text-gray-500 font-medium'>Configure taxes and additional service fees</p>
                </div>
                <button
                    onClick={openModal}
                    className='flex items-center gap-2 px-8 py-4 bg-[#323232] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-100 active:scale-95'
                >
                    <MdAdd size={24} />
                    Add Charges
                </button>
            </div>

            {/* GST Configuration Card */}
            <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all'>
                <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black'>
                        <MdAccountBalanceWallet size={30} />
                    </div>
                    <div>
                        <h4 className='text-xl font-black text-gray-800'>Fixed GST Rate</h4>
                        <p className='text-sm text-gray-400 font-medium'>Fixed amount applied to all orders globally</p>
                    </div>
                </div>
                <div className='flex items-center gap-3 w-full md:w-auto'>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsGstActive(!isGstActive)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black transition-all active:scale-95 ${isGstActive
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-gray-50 text-gray-400 border border-gray-100'
                            }`}
                    >
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isGstActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 rounded-full w-3 h-3 bg-white transition-all ${isGstActive ? 'left-6' : 'left-1'}`}></div>
                        </div>
                        <span className='text-sm uppercase tracking-wider'>{isGstActive ? 'Active' : 'Inactive'}</span>
                    </button>

                    <div className='relative flex-1 md:flex-none'>
                        <span className='absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400'>₹</span>
                        <input
                            type="number"
                            value={gstFixedAmount}
                            onChange={(e) => setGstFixedAmount(Number(e.target.value))}
                            className={`w-full md:w-32 pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-left outline-none focus:border-orange-500 focus:bg-white transition-all ${!isGstActive && 'opacity-50 pointer-events-none'}`}
                            placeholder="0"
                        />
                    </div>
                    <button
                        onClick={handleGstSave}
                        className='p-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2'
                    >
                        <MdSave size={24} />
                        <span className='md:hidden font-black'>Save</span>
                    </button>
                </div>
            </div>

            {/* Slabs Display */}
            <div className={`flex flex-col gap-4 transition-all ${isGstActive ? 'opacity-60 saturate-50' : ''}`}>
                <div className='flex items-center justify-between ml-1'>
                    <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest'>Order Amount Based Charges</h4>
                    {isGstActive && (
                        <span className='text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-tighter'>Inactive (Fixed GST Active)</span>
                    )}
                </div>
                {chargesSlabs.length === 0 ? (
                    <div className='bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 p-12 text-center'>
                        <p className='text-gray-400 font-bold'>No additional charges defined yet.</p>
                        <p className='text-xs text-gray-300 mt-1'>Click "Add Charges" to configure slab-based fees</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {chargesSlabs.map((slab, index) => (
                            <div key={index} className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden'>
                                <div className='absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-100/50 transition-colors'></div>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center'>
                                        <MdAccountBalanceWallet size={20} />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Upto amount</p>
                                        <p className='text-xl font-black text-gray-800'>₹{slab.uptoAmount}</p>
                                    </div>
                                </div>
                                <div className='pt-4 border-t border-gray-50 flex justify-between items-center'>
                                    <p className='text-xs font-bold text-gray-400 uppercase'>Charge Amount</p>
                                    <p className='text-lg font-black text-blue-600'>₹{slab.charge}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn'>
                    <div className='bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp'>
                        <div className='p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30'>
                            <h4 className='text-2xl font-black text-gray-800'>Configure Charges</h4>
                            <button onClick={() => setShowModal(false)} className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all'>
                                <MdDelete size={20} className='rotate-45' />
                            </button>
                        </div>

                        <div className='p-8 max-h-[60vh] overflow-y-auto flex flex-col gap-4'>
                            {tempSlabs.map((slab, index) => (
                                <div key={index} className='flex items-end gap-3 bg-gray-50 p-6 rounded-3xl group'>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Upto Amount (₹)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-orange-500'
                                            placeholder="500"
                                            value={slab.uptoAmount}
                                            onChange={(e) => handleSlabChange(index, 'uptoAmount', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Charge (₹)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-orange-500'
                                            placeholder="30"
                                            value={slab.charge}
                                            onChange={(e) => handleSlabChange(index, 'charge', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeSlabRow(index)}
                                        className='w-11 h-11 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mb-0.5'
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addSlabRow}
                                className='w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center gap-2 text-gray-400 font-black hover:border-orange-300 hover:text-orange-500 transition-all group'
                            >
                                <MdAdd size={24} className='group-hover:scale-110 transition-transform' />
                                Add Charge Row
                            </button>
                        </div>

                        <div className='p-8 bg-gray-50/50 flex gap-4'>
                            <button
                                onClick={() => setShowModal(false)}
                                className='flex-1 py-4.5 bg-white border-2 border-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all active:scale-95'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSlabs}
                                className='flex-1 py-4.5 bg-[#323232] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2'
                            >
                                <MdSave size={20} />
                                Save Slabs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GSTCharges
