import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { MdSecurity, MdPayment } from 'react-icons/md';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [statusText, setStatusText] = useState("Securing your payment...");

    const verifyPayment = async () => {
        try {
            // Wait a small bit for visual effect
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStatusText("Verifying order status...");

            const response = await axios.post(url + "/api/order/verify", { success, orderId });

            if (response.data.success) {
                setStatusText("Payment Successful! Redirecting...");
                setTimeout(() => navigate("/myorders"), 1000);
            }
            else {
                setStatusText("Verification failed. Redirecting...");
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (error) {
            console.error(error);
            setStatusText("Connectivity issue. Retrying...");
            setTimeout(() => navigate("/"), 2000);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className='min-h-[100vh] flex items-center justify-center px-4 pt-28 pb-12 animate-fadeIn bg-gray-50/30'>
            <div className='w-full max-w-md bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden text-center'>
                {/* Background Accent */}
                <div className='absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -mr-16 -mt-16'></div>
                <div className='absolute bottom-0 left-0 w-24 h-24 bg-orange-50/50 rounded-full blur-2xl -ml-12 -mb-12'></div>

                {/* Animated Icon/Spinner */}
                <div className='relative mb-10'>
                    <div className="w-[120px] h-[120px] mx-auto border-[3px] border-gray-50 border-t-orange-500 rounded-full animate-spin"></div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-500 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-orange-200'>
                        <MdSecurity size={32} />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className='text-3xl font-black text-gray-800 mb-2 tracking-tight'>Verification</h2>
                <div className='flex items-center justify-center gap-2 mb-8'>
                    <div className='flex gap-1'>
                        <span className='w-1 h-1 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                        <span className='w-1 h-1 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '200ms' }}></span>
                        <span className='w-1 h-1 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '400ms' }}></span>
                    </div>
                    <p className='text-gray-400 font-bold text-xs uppercase tracking-[0.2em]'>{statusText}</p>
                </div>

                {/* Info Card */}
                <div className='bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 text-left'>
                    <div className='w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-orange-500'>
                        <MdPayment size={20} />
                    </div>
                    <div>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1'>Processing</p>
                        <p className='text-xs font-bold text-gray-600'>Order #{orderId?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <p className='mt-8 text-[10px] text-gray-300 font-medium uppercase tracking-widest'>Please do not refresh or close this window</p>
            </div>
        </div>
    )
}

export default Verify
