import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdAdd, MdDeleteOutline, MdCloudUpload } from "react-icons/md";
import { StoreContext } from '../../../context/StoreContext';
import { useContext } from 'react';

const AddCombo = ({ url, token }) => {
    const { getImageUrl } = useContext(StoreContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [foodItem, setFoodItem] = useState(null);
    const [addons, setAddons] = useState([]);

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`${url}/api/food/get-item?id=${id}`);
            if (response.data.success) {
                setFoodItem(response.data.data);
                if (response.data.data.addOns && response.data.data.addOns.length > 0) {
                    // Populate existing addons
                    const existingAddons = response.data.data.addOns.map(addon => ({
                        id: Math.random().toString(36).substr(2, 9),
                        name: addon.name,
                        price: addon.price,
                        image: addon.image,
                        isNewImage: false,
                        file: null
                    }));
                    setAddons(existingAddons);
                } else {
                    // Default one empty row
                    handleAddonRow();
                }
            } else {
                toast.error("Error fetching item details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching item details");
        }
    };

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const handleAddonRow = () => {
        setAddons([...addons, {
            id: Math.random().toString(36).substr(2, 9),
            name: "",
            price: "",
            image: "",
            isNewImage: false,
            file: null
        }]);
    };

    const removeAddonRow = (addonId) => {
        setAddons(addons.filter(addon => addon.id !== addonId));
    };

    const handleInputChange = (addonId, field, value) => {
        setAddons(addons.map(addon => {
            if (addon.id === addonId) {
                return { ...addon, [field]: value };
            }
            return addon;
        }));
    };

    const handleImageChange = (addonId, file) => {
        setAddons(addons.map(addon => {
            if (addon.id === addonId) {
                return { 
                    ...addon, 
                    file: file, 
                    isNewImage: true, 
                    image: URL.createObjectURL(file) 
                };
            }
            return addon;
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        // Validation
        for (let addon of addons) {
            if (!addon.name) return toast.error("All combo options must have a name");
            if (!addon.price) return toast.error("All combo options must have a price");
            if (!addon.image) return toast.error("All combo options must have an image");
        }

        const formData = new FormData();
        formData.append("id", id);
        
        // Append all files in order
        const addonsDataToSave = addons.map(addon => {
            if (addon.isNewImage && addon.file) {
                formData.append("addonImages", addon.file);
            }
            return {
                name: addon.name,
                price: addon.price,
                isNewImage: addon.isNewImage,
                image: addon.isNewImage ? '' : addon.image // if not new, send existing URL
            };
        });

        formData.append("addonsData", JSON.stringify(addonsDataToSave));

        try {
            const response = await axios.post(`${url}/api/food/update-addons`, formData, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/master-control-gate/list');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving combos");
        }
    };

    if (!foodItem) return <div className='p-8 text-center'>Loading...</div>;

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-3xl font-black text-gray-900 mb-1 tracking-tight'>Manage Combo Options</h3>
                    <p className='text-sm text-gray-500 font-medium'>Add specific sub-items attached to: <span className='font-bold text-orange-500'>{foodItem.name}</span></p>
                </div>
                <button type='button' onClick={() => navigate('/master-control-gate/list')} className='px-6 py-2 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all'>
                    Go Back
                </button>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>
                {addons.map((addon, index) => (
                    <div key={addon.id} className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative group transition-all hover:shadow-md'>
                        {/* Remove Row Button */}
                        <button 
                            type='button' 
                            onClick={() => removeAddonRow(addon.id)} 
                            className='absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10'
                            title="Remove this combo option"
                        >
                            <MdDeleteOutline size={18} />
                        </button>

                        <div className='w-full md:w-32 flex-shrink-0'>
                            <label className='cursor-pointer group flex flex-col items-center gap-2'>
                                <div className={`w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${addon.image ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-400 bg-gray-50'}`}>
                                    {addon.image ? (
                                        <img src={getImageUrl(addon.image)} className='w-full h-full object-cover' alt="Addon" />
                                    ) : (
                                        <div className='flex flex-col items-center gap-1 text-gray-300'>
                                            <MdCloudUpload size={28} />
                                            <span className='text-[10px] font-bold uppercase'>Upload</span>
                                        </div>
                                    )}
                                </div>
                                <input type='file' hidden accept='image/*' onChange={(e) => {
                                    if (e.target.files[0]) handleImageChange(addon.id, e.target.files[0]);
                                }} />
                            </label>
                        </div>

                        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow'>
                            <div className='flex flex-col gap-2'>
                                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Option Name</label>
                                <input 
                                    type='text' 
                                    required
                                    value={addon.name}
                                    onChange={(e) => handleInputChange(addon.id, 'name', e.target.value)}
                                    placeholder='e.g. Extra Roti'
                                    className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white text-sm font-semibold shadow-sm'
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Price (₹)</label>
                                <input 
                                    type='number' 
                                    required
                                    min='0'
                                    value={addon.price}
                                    onChange={(e) => handleInputChange(addon.id, 'price', e.target.value)}
                                    placeholder='e.g. 20'
                                    className='p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-orange-500 focus:bg-white text-sm font-black text-gray-800 shadow-sm'
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {addons.length === 0 && (
                    <div className='p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200'>
                        <p className='text-gray-500'>No combo options added yet. Click "+ Add Option" to start.</p>
                    </div>
                )}

                <div className='flex items-center gap-4 mt-2'>
                    <button 
                        type='button' 
                        onClick={handleAddonRow}
                        className='px-6 py-4 bg-orange-50 text-orange-600 font-bold rounded-2xl hover:bg-orange-100 transition-all flex items-center gap-2 border border-orange-100'
                    >
                        <MdAdd size={24} />
                        Add Another Option
                    </button>
                    
                    <button 
                        type='submit' 
                        className='flex-grow md:flex-grow-0 px-12 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1'
                    >
                        Save Combo Options
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCombo;
