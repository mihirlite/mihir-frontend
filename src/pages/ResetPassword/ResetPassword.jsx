import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/user/reset-password`, { token, password });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gray-50/50'>
            <div className='w-full max-w-[450px] bg-white p-8 md:p-10 rounded-[32px] shadow-2xl border border-gray-100 flex flex-col gap-8 animate-fadeIn'>
                <div className='text-center'>
                    <h2 className='text-3xl font-black text-[#323232] mb-3'>Create New Password</h2>
                    <p className='text-gray-500 font-medium'>Please enter your new password below.</p>
                </div>

                <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-bold text-gray-700 ml-1'>New Password</label>
                        <input
                            type="password"
                            placeholder='Enter new password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='outline-none border-2 border-gray-100 p-4 rounded-2xl focus:border-orange-500 focus:bg-white bg-gray-50 transition-all duration-300'
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-bold text-gray-700 ml-1'>Confirm New Password</label>
                        <input
                            type="password"
                            placeholder='Confirm new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className='outline-none border-2 border-gray-100 p-4 rounded-2xl focus:border-orange-500 focus:bg-white bg-gray-50 transition-all duration-300'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-[#323232] text-white font-black py-4 rounded-2xl text-lg mt-2 hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-orange-200 active:scale-95 disabled:bg-gray-400 disabled:scale-100'
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>

                <div className='text-center'>
                    <button
                        onClick={() => navigate('/')}
                        className='text-orange-500 font-bold hover:underline transition-all'
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
