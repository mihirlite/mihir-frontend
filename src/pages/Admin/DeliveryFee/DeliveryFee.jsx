import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdAdd, MdDelete, MdLocalShipping, MdSave, MdToggleOn, MdToggleOff } from "react-icons/md";

const DeliveryFee = ({ url, token }) => {
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);
    const [slabs, setSlabs] = useState([]);
    const [distanceSlabs, setDistanceSlabs] = useState([]);
    const [locations, setLocations] = useState([]);
    
    const [showModal, setShowModal] = useState(false); // Modal for Amount Slabs
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const [tempSlabs, setTempSlabs] = useState([]);
    const [tempDistanceSlabs, setTempDistanceSlabs] = useState([]);
    const [tempLocations, setTempLocations] = useState([]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(url + "/api/delivery/get");
            if (response.data.success) {
                setIsFreeDelivery(response.data.data.isFreeDelivery);
                setSlabs(response.data.data.slabs || []);
                setDistanceSlabs(response.data.data.distanceSlabs || []);
                setLocations(response.data.data.locations || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching delivery settings");
        }
    }

    const saveSettings = async (finalIsFree, finalSlabs, finalDistanceSlabs, finalLocations) => {
        try {
            // Priority: Argument value OR current state value
            const payload = {
                isFreeDelivery: finalIsFree !== undefined ? finalIsFree : isFreeDelivery,
                slabs: finalSlabs !== undefined ? finalSlabs : slabs,
                distanceSlabs: finalDistanceSlabs !== undefined ? finalDistanceSlabs : distanceSlabs,
                locations: finalLocations !== undefined ? finalLocations : locations
            };

            const response = await axios.post(url + "/api/delivery/update", payload, { headers: { token } });
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
        saveSettings(newValue, slabs, distanceSlabs, locations);
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
        const isValid = tempSlabs.every(s => s.uptoAmount > 0 && s.deliveryCharge >= 0);
        if (!isValid) {
            toast.error("Please provide valid values for all slabs");
            return;
        }
        const sorted = [...tempSlabs].sort((a, b) => Number(a.uptoAmount) - Number(b.uptoAmount));
        setSlabs(sorted);
        // Pass sorted directly to avoid state lag
        saveSettings(isFreeDelivery, sorted, distanceSlabs, locations);
        setShowModal(false);
    }

    // Distance Slabs Handlers
    const openDistanceModal = () => {
        setTempDistanceSlabs([...distanceSlabs]);
        setShowDistanceModal(true);
    }
    const addDistanceSlabRow = () => {
        setTempDistanceSlabs([...tempDistanceSlabs, { uptoDistance: "", deliveryCharge: "" }]);
    }
    const removeDistanceSlabRow = (index) => {
        setTempDistanceSlabs(tempDistanceSlabs.filter((_, i) => i !== index));
    }
    const handleDistanceSlabChange = (index, field, value) => {
        const newSlabs = [...tempDistanceSlabs];
        newSlabs[index][field] = value ? Number(value) : "";
        setTempDistanceSlabs(newSlabs);
    }
    const saveDistanceSlabs = () => {
        const isValid = tempDistanceSlabs.every(s => s.uptoDistance > 0 && s.deliveryCharge >= 0);
        if (!isValid) {
            toast.error("Please provide valid values for distance slabs");
            return;
        }
        const sorted = [...tempDistanceSlabs].sort((a, b) => Number(a.uptoDistance) - Number(b.uptoDistance));
        setDistanceSlabs(sorted);
        
        // Use local sorted variable to avoid React state update lag
        saveSettings(isFreeDelivery, slabs, sorted, locations);
        setShowDistanceModal(false);
    }

    // Locations Handlers
    const openLocationModal = () => {
        setTempLocations([...locations]);
        setShowLocationModal(true);
    }
    const addLocationRow = () => {
        setTempLocations([...tempLocations, { name: "", distance: "" }]);
    }
    const removeLocationRow = (index) => {
        setTempLocations(tempLocations.filter((_, i) => i !== index));
    }
    const handleLocationChange = (index, field, value) => {
        const newLocs = [...tempLocations];
        newLocs[index][field] = field === 'distance' ? (value ? Number(value) : "") : value;
        setTempLocations(newLocs);
    }
    const saveLocations = () => {
        const isValid = tempLocations.every(l => l.name && l.name.trim() !== "" && l.distance > 0);
        if (!isValid) {
            toast.error("Please provide valid name and distance for all locations");
            return;
        }
        const cleaned = tempLocations.map(l => ({ ...l, name: l.name.trim() }));
        const sorted = cleaned.sort((a, b) => a.name.localeCompare(b.name));
        setLocations(sorted);
        saveSettings(isFreeDelivery, slabs, distanceSlabs, sorted);
        setShowLocationModal(false);
    }

    useEffect(() => {
        fetchSettings();
    }, [])

    return (
        <div className='animate-fadeIn flex flex-col gap-4 sm:gap-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6'>
                <div>
                    <h3 className='text-2xl sm:text-3xl font-black text-gray-800 mb-1'>Delivery Fee Settings</h3>
                    <p className='text-sm text-gray-500 font-medium'>Configure distance-based fees and delivery locations</p>
                </div>
                <div className='flex flex-wrap gap-3'>
                    <button
                        onClick={openLocationModal}
                        className='flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 text-sm'
                    >
                        <MdAdd size={20} />
                        Manage Locations
                    </button>
                    <button
                        onClick={openDistanceModal}
                        className='flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95 text-sm'
                    >
                        <MdAdd size={20} />
                        Distance Slabs
                    </button>
                    <button
                        onClick={openModal}
                        className='flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-2xl font-bold hover:bg-gray-700 transition-all shadow-lg active:scale-95 text-sm'
                    >
                        <MdAdd size={20} />
                        Amount Slabs
                    </button>
                </div>
            </div>

            {/* Global Toggle Card */}
            <div className='bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all'>
                <div className='flex items-center gap-3 sm:gap-4'>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${isFreeDelivery ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <MdLocalShipping size={28} />
                    </div>
                    <div className="min-w-0">
                        <h4 className='text-lg sm:text-xl font-black text-gray-800 truncate'>Free Delivery</h4>
                        <p className='text-[10px] sm:text-sm text-gray-400 font-medium leading-tight'>Global override for all orders</p>
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

            {/* Distance Slabs Display */}
            <div className='flex flex-col gap-4'>
                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest ml-1'>Distance Fee Slabs (km)</h4>
                {distanceSlabs.length === 0 ? (
                    <div className='bg-green-50/30 rounded-[2rem] border-2 border-dashed border-green-100 p-8 text-center'>
                        <p className='text-green-600/60 font-bold'>No distance slabs defined yet.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {distanceSlabs.map((slab, index) => (
                            <div key={index} className='bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden'>
                                <p className='text-[10px] font-black text-green-500 uppercase tracking-widest mb-1'>Upto Distance</p>
                                <p className='text-xl font-black text-gray-800 mb-3'>{slab.uptoDistance} km</p>
                                <div className='pt-3 border-t border-gray-50 flex justify-between items-center'>
                                    <p className='text-[10px] font-bold text-gray-400 uppercase'>Charge</p>
                                    <p className='text-lg font-black text-green-600'>₹{slab.deliveryCharge}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Locations Display */}
            <div className='flex flex-col gap-4'>
                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest ml-1'>Delivery Locations</h4>
                {locations.length === 0 ? (
                    <div className='bg-indigo-50/30 rounded-[2rem] border-2 border-dashed border-indigo-100 p-8 text-center'>
                        <p className='text-indigo-600/60 font-bold'>No locations added yet.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {locations.map((loc, index) => (
                            <div key={index} className='bg-white p-5 rounded-3xl border border-gray-100 shadow-sm'>
                                <p className='text-sm font-black text-gray-800 truncate mb-1'>{loc.name}</p>
                                <div className='flex items-center justify-between'>
                                    <p className='text-xs font-bold text-gray-400 uppercase tracking-tighter'>Distance</p>
                                    <p className='text-sm font-black text-indigo-600'>{loc.distance} km</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Amount Slabs Display */}
            <div className='flex flex-col gap-4 opacity-70'>
                <h4 className='text-sm font-black text-gray-400 uppercase tracking-widest ml-1 text-[10px]'>Legacy Amount Fee Slabs (Optional)</h4>
                {slabs.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        {slabs.map((slab, index) => (
                            <div key={index} className='bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center'>
                                <div>
                                    <p className='text-[8px] font-black text-gray-400 uppercase'>Upto ₹{slab.uptoAmount}</p>
                                </div>
                                <p className='text-sm font-black text-gray-600'>₹{slab.deliveryCharge}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn'>
                    <div className='bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp'>
                        <div className='p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50'>
                            <h4 className='text-xl sm:text-2xl font-black text-gray-800'>Amount Slabs</h4>
                            <button onClick={() => setShowModal(false)} className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all'>
                                <MdDelete size={18} className='rotate-45' />
                            </button>
                        </div>
                        <div className='p-4 sm:p-8 max-h-[60vh] overflow-y-auto flex flex-col gap-3 sm:gap-4'>
                            {tempSlabs.map((slab, index) => (
                                <div key={index} className='flex items-end gap-3 bg-gray-50 p-6 rounded-3xl group'>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Upto Amount (₹)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-gray-500'
                                            placeholder="500"
                                            value={slab.uptoAmount}
                                            onChange={(e) => handleSlabChange(index, 'uptoAmount', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Charge (₹)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-gray-500'
                                            placeholder="50"
                                            value={slab.deliveryCharge}
                                            onChange={(e) => handleSlabChange(index, 'deliveryCharge', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeSlabRow(index)}
                                        className='w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mb-0.5 shrink-0'
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addSlabRow}
                                className='w-full py-3.5 sm:py-4 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 text-gray-400 font-black hover:border-gray-300 hover:text-gray-500 transition-all text-sm'
                            >
                                <MdAdd size={24} />
                                Add Amount Slab
                            </button>
                        </div>
                        <div className='p-4 sm:p-8 bg-gray-50/50 flex gap-3 sm:gap-4'>
                            <button
                                onClick={() => setShowModal(false)}
                                className='flex-1 py-4.5 bg-white border-2 border-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSlabs}
                                className='flex-1 py-4.5 bg-[#323232] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2'
                            >
                                <MdSave size={20} />
                                Save Amount Fees
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDistanceModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn'>
                    <div className='bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp'>
                        <div className='p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-green-50/30'>
                            <h4 className='text-xl sm:text-2xl font-black text-gray-800'>Distance Slabs (km)</h4>
                            <button onClick={() => setShowDistanceModal(false)} className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all'>
                                <MdDelete size={18} className='rotate-45' />
                            </button>
                        </div>
                        <div className='p-4 sm:p-8 max-h-[60vh] overflow-y-auto flex flex-col gap-3 sm:gap-4'>
                            {tempDistanceSlabs.map((slab, index) => (
                                <div key={index} className='flex items-end gap-3 bg-gray-50 p-6 rounded-3xl group'>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Upto Distance (km)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-green-500'
                                            placeholder="2"
                                            value={slab.uptoDistance}
                                            onChange={(e) => handleDistanceSlabChange(index, 'uptoDistance', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Charge (₹)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-green-500'
                                            placeholder="20"
                                            value={slab.deliveryCharge}
                                            onChange={(e) => handleDistanceSlabChange(index, 'deliveryCharge', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeDistanceSlabRow(index)}
                                        className='w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mb-0.5 shrink-0'
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addDistanceSlabRow}
                                className='w-full py-3.5 sm:py-4 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 text-gray-400 font-black hover:border-green-300 hover:text-green-500 transition-all text-sm'
                            >
                                <MdAdd size={24} />
                                Add Distance Slab
                            </button>
                        </div>
                        <div className='p-4 sm:p-8 bg-gray-50/50 flex gap-3 sm:gap-4'>
                            <button
                                onClick={() => setShowDistanceModal(false)}
                                className='flex-1 py-4.5 bg-white border-2 border-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveDistanceSlabs}
                                className='flex-1 py-4.5 bg-[#323232] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2'
                            >
                                <MdSave size={20} />
                                Save Distance Fees
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLocationModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn'>
                    <div className='bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp'>
                        <div className='p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-indigo-50/30'>
                            <h4 className='text-xl sm:text-2xl font-black text-gray-800'>Delivery Locations</h4>
                            <button onClick={() => setShowLocationModal(false)} className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all'>
                                <MdDelete size={18} className='rotate-45' />
                            </button>
                        </div>
                        <div className='p-4 sm:p-8 max-h-[60vh] overflow-y-auto flex flex-col gap-3 sm:gap-4'>
                            {tempLocations.map((loc, index) => (
                                <div key={index} className='flex items-end gap-3 bg-gray-50 p-6 rounded-3xl group'>
                                    <div className='flex-[2]'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Area Name</p>
                                        <input
                                            type="text"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-indigo-500'
                                            placeholder="e.g. Naraj Depot"
                                            value={loc.name}
                                            onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1'>Distance (km)</p>
                                        <input
                                            type="number"
                                            className='w-full p-3 bg-white border border-gray-100 rounded-xl font-bold outline-none focus:border-indigo-500'
                                            placeholder="5.5"
                                            value={loc.distance}
                                            onChange={(e) => handleLocationChange(index, 'distance', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeLocationRow(index)}
                                        className='w-11 h-11 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all mb-0.5'
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addLocationRow}
                                className='w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center gap-2 text-gray-400 font-black hover:border-indigo-300 hover:text-indigo-500 transition-all'
                            >
                                <MdAdd size={24} />
                                Add Delivery Area
                            </button>
                        </div>
                        <div className='p-8 bg-gray-50/50 flex gap-4'>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className='flex-1 py-4.5 bg-white border-2 border-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveLocations}
                                className='flex-1 py-4.5 bg-[#323232] text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2'
                            >
                                <MdSave size={20} />
                                Save Areas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeliveryFee
