import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdEmail, MdLockOutline, MdLocalShipping } from "react-icons/md";
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../../assets/logo/logo.png'

const Login = () => {
    const { url, setToken, setRefreshToken, setRole } = useContext(StoreContext);
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
            const loginUrl = `${url.replace(/\/$/, "")}/api/user/delivery-login`;
            const response = await axios.post(loginUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                setRole("delivery");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("role", "delivery");
                toast.success("Welcome back, Delivery Partner!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Delivery Login Frontend Error:", error);
            toast.error(error.response?.data?.message || "Login Error");
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#fdfdfd] p-4 relative overflow-hidden'>
            <div className='absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]'></div>
            <div className='absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]'></div>

            <div className='w-full max-w-[450px] animate-fadeIn'>
                <div className='bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-blue-500/5 relative z-10'>
                    <div className='flex flex-col items-center mb-10'>
                        <div className='w-full flex items-center justify-center mb-6'>
                            <img src={logo} alt="Logo" className='w-32 object-contain' />
                        </div>
                        <h2 className='text-3xl font-black text-gray-800 tracking-tight'>Delivery Portal</h2>
                        <p className='text-gray-400 font-medium mt-2'>Access your daily deliveries</p>
                    </div>

                    <form onSubmit={onLoginHandler} className='flex flex-col gap-6'>
                        <div className='relative'>
                            <MdEmail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
                            <input
                                onChange={onChangeHandler}
                                value={data.email}
                                name='email'
                                type="email"
                                placeholder='Delivery Email'
                                required
                                className='w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-700'
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
                                className='w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-700'
                            />
                        </div>

                        <button
                            type='submit'
                            className='mt-4 w-full py-4 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-600 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200 uppercase tracking-widest text-sm'
                        >
                            Sign In
                        </button>
                    </form>

                    <div className='mt-8 flex flex-col gap-4'>
                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-gray-100 w-full absolute"></div>
                            <span className="bg-white px-4 text-xs text-gray-400 font-bold uppercase tracking-widest relative z-10">OR</span>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const res = await axios.post(url + "/api/user/google", { token: credentialResponse.credential });
                                        if (res.data.success && res.data.role === 'delivery') {
                                            setToken(res.data.token);
                                            setRefreshToken(res.data.refreshToken);
                                            setRole("delivery");
                                            localStorage.setItem("token", res.data.token);
                                            localStorage.setItem("refreshToken", res.data.refreshToken);
                                            localStorage.setItem("role", "delivery");
                                            toast.success("Welcome back, Delivery Partner!");
                                        } else if (res.data.success) {
                                            toast.error("This Google account is not registered as a delivery partner.");
                                        }
                                    } catch (error) {
                                        toast.error("Google Login Failed");
                                    }
                                }}
                                onError={() => {
                                    toast.error('Login Failed');
                                }}
                                theme="outline"
                                shape="pill"
                                text="continue_with"
                                width="100%"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
