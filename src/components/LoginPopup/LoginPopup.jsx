import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { GoogleLogin } from '@react-oauth/google';
import { RxCross2 } from "react-icons/rx";

const LoginPopup = () => {

    const { url, setToken, setRefreshToken, setRole, setShowLogin } = useContext(StoreContext)

    const [currState, setCurrState] = useState("Login")
    const [errorMsg, setErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
        // clear messages on type
        setErrorMsg("");
        setPasswordErrorMsg("");
        setSuccessMsg("");
    }

    const onLogin = async (event) => {
        event.preventDefault()
        setLoading(true);
        let newUrl = url;
        setErrorMsg("");
        setPasswordErrorMsg("");
        setSuccessMsg("");

        try {
            if (currState === "Login") {
                newUrl += "/api/user/login"
            }
            else if (currState === "Sign Up") {
                newUrl += "/api/user/register"
            }
            else {
                newUrl += "/api/user/forgot-password"
                const response = await axios.post(newUrl, { email: data.email });
                if (response.data.success) {
                    setSuccessMsg(response.data.message);
                } else {
                    setErrorMsg(response.data.message);
                }
                setLoading(false);
                return;
            }

            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                setRefreshToken(response.data.refreshToken);
                setRole(response.data.role || "user");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("role", response.data.role || "user");
                setShowLogin(false)
            }
            else {
                if (response.data.message === "Invalid Credentials" || response.data.message === "Please enter a strong password") {
                    setPasswordErrorMsg(response.data.message);
                } else {
                    setErrorMsg(response.data.message);
                }
            }
        } catch (error) {
            setErrorMsg("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='fixed inset-0 z-[9999] w-full h-full bg-black/60 backdrop-blur-sm grid place-items-center animate-fadeIn'>
            <form onSubmit={onLogin} className="relative w-[90%] max-w-[400px] bg-white flex flex-col gap-6 p-8 rounded-2xl shadow-2xl animate-scaleIn">
                <div className="flex justify-between items-center">
                    <h2 className='text-2xl font-bold text-gray-800'>{currState}</h2>
                    <button
                        type="button"
                        onClick={() => setShowLogin(false)}
                        className='cursor-pointer text-gray-500 hover:text-black transition-colors duration-300 transform hover:rotate-90 p-1'
                    >
                        <RxCross2 size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {currState === "Sign Up" && (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder='Your name'
                            required
                            className='outline-none border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300'
                        />
                    )}
                    <div>
                        <input
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder='Your email'
                            required
                            className={`w-full outline-none border p-3 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ${errorMsg ? 'border-red-500 focus:ring-red-500' : successMsg ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-orange-500'}`}
                        />
                        {errorMsg && (
                            <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-fadeIn">{errorMsg}</p>
                        )}
                        {successMsg && (
                            <p className="text-green-600 text-xs font-bold mt-1 ml-1 animate-fadeIn">{successMsg}</p>
                        )}
                    </div>
                    {currState !== "Forgot Password" && (
                        <div className="flex flex-col gap-2">
                            <div>
                                <input
                                    name='password'
                                    onChange={onChangeHandler}
                                    value={data.password}
                                    type="password"
                                    placeholder='Password'
                                    required
                                    className={`w-full outline-none border p-3 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ${passwordErrorMsg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'}`}
                                />
                                {passwordErrorMsg && (
                                    <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-fadeIn">{passwordErrorMsg}</p>
                                )}
                            </div>
                            {currState === "Login" && (
                                <p
                                    onClick={() => setCurrState("Forgot Password")}
                                    className='text-xs text-orange-500 font-semibold cursor-pointer text-right hover:underline'
                                >
                                    Forgot Password?
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-base cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                            currState === "Sign Up" ? "Create account" : currState === "Login" ? "Login" : "Send reset link"
                        )}
                    </button>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-gray-200 w-full absolute"></div>
                        <span className="bg-white px-3 text-xs text-gray-500 relative z-10">OR</span>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const res = await axios.post(url + "/api/user/google", { token: credentialResponse.credential });
                                    if (res.data.success) {
                                        setToken(res.data.token);
                                        setRefreshToken(res.data.refreshToken);
                                        setRole(res.data.role || "user");
                                        localStorage.setItem("token", res.data.token);
                                        localStorage.setItem("refreshToken", res.data.refreshToken);
                                        localStorage.setItem("role", res.data.role || "user");
                                        setShowLogin(false)
                                    }
                                } catch (error) {
                                    alert("Google Login Failed")
                                }
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            containerProps={{
                                className: 'w-full flex justify-center'
                            }}
                        />
                    </div>
                </div>
                {currState === "Sign Up" && (
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                        <input type="checkbox" required defaultChecked className='mt-1 accent-orange-500' />
                        <p>By continuing, I agree to the <Link to='/terms' onClick={() => setShowLogin(false)} className='text-orange-500 font-bold hover:underline'>terms of use & privacy policy</Link>.</p>
                    </div>
                )}
                {currState === "Login"
                    ? <p className='text-sm text-gray-500 text-center'>Create a new account? <span onClick={() => setCurrState("Sign Up")} className='text-orange-500 font-bold cursor-pointer hover:underline'>Click here</span></p>
                    : currState === "Sign Up" ? <p className='text-sm text-gray-500 text-center'>Already have an account? <span onClick={() => setCurrState("Login")} className='text-orange-500 font-bold cursor-pointer hover:underline'>Login here</span></p>
                        : <p className='text-sm text-gray-500 text-center'>Remember your password? <span onClick={() => setCurrState("Login")} className='text-orange-500 font-bold cursor-pointer hover:underline'>Back to Login</span></p>
                }
            </form >
        </div >
    )
}

export default LoginPopup
