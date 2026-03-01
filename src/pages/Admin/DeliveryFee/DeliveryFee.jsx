import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdAdd, MdDelete, MdLocalShipping, MdSave, MdToggleOn, MdToggleOff } from "react-icons/md";

const DeliveryFee = ({ url, token }) => {
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);
    const [slabs, setSlabs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tempSlabs, setTempSlabs] = useState([]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(url + "/api/delivery/get");
            if (response.data.success) {
                setIsFreeDelivery(response.data.data.isFreeDelivery);
                setSlabs(response.data.data.slabs || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching delivery settings");
        }
    }

    const saveSettings = async (finalIsFree, finalSlabs) => {
        try {
            const response = await axios.post(url + "/api/delivery/update",
                { isFreeDelivery: finalIsFree, slabs: finalSlabs },
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

    const handleToggle = () => {
        const newValue = !isFreeDelivery;
        setIsFreeDelivery(newValue);
        saveSettings(newValue, slabs);
    }

    const openModal = () => {
        setTempSlabs([...slabs]);
        setShowModal(true);
    }

    const addSlabRow = () => {
        setTempSlabs([...tempSlabs, { uptoAmount: "", deliveryCharge: "" }]);
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
        const isValid = tempSlabs.every(s => s.uptoAmount > 0 && s.deliveryCharge >= 0);
        if (!isValid) {
            toast.error("Please provide valid values for all slabs");
            return;
        }

        const sorted = [...tempSlabs].sort((a, b) => a.uptoAmount - b.uptoAmount);
        setSlabs(sorted);
        saveSettings(isFreeDelivery, sorted);
        setShowModal(false);
    }

    useEffect(() => {
        fetchSettings();
    }, [])

    return (
        <div className='animate-fadeIn flex flex-col gap-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div>
                    <h3 className='text-3xl font-black text-gray-800 mb-1'>Delivery Fee Settings</h3>
                    <p className='text-sm text-gray-500 font-medium'>Configure delivery costs and free shipping zones</p>
                </div>
                <button
                    onClick={openModal}
                    className='flex items-center gap-2 px-8 py-4 bg-[#ff7e00] text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95'
                >
                    <MdAdd size={24} />
                    Add Delivery Fee
                </button>
            </div>

            {/* Global Toggle Card */}
            <div className='bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all'>
                <div className='flex items-center gap-4'>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isFreeDelivery ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <MdLocalShipping size={30} />
                    </div>
                    <div>
                        <h4 className='text-xl font-black text-gray-800'>Free Delivery for Everyone</h4>
                        <p className='text-sm text-gray-400 font-medium'>Ignore slabs and make all orders free delivery</p>
                    </div>
                </div>
                <button onClick={handleToggle} className='transition-all active:scale-95'>
                    {isFreeDelivery ? (
                        <MdToggleOn className='text-6xl text-green-500' />
                    ) : (
                        <MdToggleOff className='text-6xl text-gray-300' />
                    )}
                </button>
            </div>

            {/* Slabs Display */}
            <div className='flex flex-col gap-4'>
                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest ml-1'>Active Fee Slabs</h4>
                {slabs.length === 0 ? (
                    <div className='bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 p-12 text-center'>
                        <p className='text-gray-400 font-bold'>No delivery slabs defined yet.</p>
                        <p className='text-xs text-gray-300 mt-1'>Click "Add Delivery Fee" to start configuring</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {slabs.map((slab, index) => (
                            <div key={index} className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden'>
                                <div className='absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-orange-100/50 transition-colors'></div>
                                <p className='text-xs font-black text-orange-500 uppercase tracking-widest mb-2'>Upto amount</p>
                                <p className='text-2xl font-black text-gray-800 mb-4'>₹{slab.uptoAmount}</p>
                                <div className='pt-4 border-t border-gray-50 flex justify-between items-center'>
                                    <p className='text-xs font-bold text-gray-400 uppercase'>Delivery Charge</p>
                                    <p className='text-lg font-black text-orange-600'>₹{slab.deliveryCharge}</p>
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
                            <h4 className='text-2xl font-black text-gray-800'>Configure Fee Slabs</h4>
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
                                            value={slab.deliveryCharge}
                                            onChange={(e) => handleSlabChange(index, 'deliveryCharge', e.target.value)}
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
                                Add Slab Row
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
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeliveryFee
