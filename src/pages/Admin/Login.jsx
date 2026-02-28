import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdEmail, MdLockOutline, MdOutlineAdminPanelSettings } from "react-icons/md";

const Login = ({ setToken, url }) => {
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLoginHandler = async (event) => {
        event.preventDefault();
        try {
            const loginUrl = `${url.replace(/\/$/, "")}/api/user/admin-login`;
            console.log("Attempting admin login at:", loginUrl);
            const response = await axios.post(loginUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("admin-token", response.data.token);
                toast.success("Welcome back, Admin!");
            } else {
                console.warn("Admin login failed:", response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Admin Login Frontend Error:", error);
            toast.error(error.response?.data?.message || "Login Error");
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#fdfdfd] p-4 relative overflow-hidden'>
            {/* Background Decorative Elements */}
            <div className='absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[100px]'></div>
            <div className='absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-50/50 rounded-full blur-[100px]'></div>

            <div className='w-full max-w-[450px] animate-fadeIn'>
                <div className='bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-orange-500/5 relative z-10'>
                    <div className='flex flex-col items-center mb-10'>
                        <div className='w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200 mb-6'>
                            <MdOutlineAdminPanelSettings className='text-4xl text-white' />
                        </div>
                        <h2 className='text-3xl font-black text-gray-800 tracking-tight'>Admin Portal</h2>
                        <p className='text-gray-400 font-medium mt-2'>Secure access for Flavohub</p>
                    </div>

                    <form onSubmit={onLoginHandler} className='flex flex-col gap-6'>
                        <div className='relative'>
                            <MdEmail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
                            <input
                                onChange={onChangeHandler}
                                value={data.email}
                                name='email'
                                type="email"
                                placeholder='Admin Email'
                                required
                                className='w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-medium text-gray-700'
                            />
                        </div>

                        <div className='relative'>
                            <MdLockOutline className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
                            <input
                                onChange={onChangeHandler}
                                value={data.password}
                                name='password'
                                type="password"
                                placeholder='Password'
                                required
                                className='w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-medium text-gray-700'
                            />
                        </div>

                        <button
                            type='submit'
                            className='mt-4 w-full py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-200 uppercase tracking-widest text-sm'
                        >
                            Sign In
                        </button>
                    </form>

                    <div className='mt-10 text-center'>
                        <p className='text-xs text-gray-400 font-bold uppercase tracking-widest'>Protected by 256-bit encryption</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
