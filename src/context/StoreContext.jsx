import { createContext, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "https://mihir-backend.vercel.app";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [wishlistItems, setWishlistItems] = useState({});
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [deliverySettings, setDeliverySettings] = useState({ isFreeDelivery: false, slabs: [] });
    const [gstCharges, setGstCharges] = useState({ gstFixedAmount: 0, isGstActive: true, chargesSlabs: [] });

    const applyCoupon = async (couponName) => {
        try {
            const response = await axios.post(url + "/api/coupon/verify", { name: couponName });
            if (response.data.success) {
                setAppliedCoupon(response.data.data);
                toast.success(response.data.message);
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("Error applying coupon");
            return false;
        }
    }

    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;
        const subtotal = getTotalCartAmount();
        if (appliedCoupon.type === 'percentage') {
            return Math.floor((subtotal * appliedCoupon.value) / 100);
        } else if (appliedCoupon.type === 'fixed') {
            return appliedCoupon.value;
        }
        return 0;
    }

    const fetchDeliverySettings = async () => {
        try {
            const response = await axios.get(url + "/api/delivery/get");
            if (response.data.success) {
                setDeliverySettings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching delivery settings");
        }
    }

    const getDeliveryFee = (subtotal) => {
        if (subtotal === 0 || deliverySettings.isFreeDelivery) return 0;

        // Find the first slab where subtotal <= uptoAmount
        const matchingSlab = deliverySettings.slabs.find(slab => subtotal <= slab.uptoAmount);

        if (matchingSlab) {
            return matchingSlab.deliveryCharge;
        }

        // If no slab matches (subtotal exceeds highest slab), default to 0
        return 0;
    }

    const fetchGSTCharges = async () => {
        try {
            const response = await axios.get(url + "/api/gst-charges/get");
            if (response.data.success) {
                setGstCharges(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching GST & Charges settings");
        }
    }

    const getGSTAmount = (subtotal) => {
        if (subtotal === 0 || !gstCharges.isGstActive) return 0;
        return gstCharges.gstFixedAmount;
    }

    const getChargesAmount = (subtotal) => {
        if (subtotal === 0 || gstCharges.isGstActive) return 0;
        const matchingSlab = gstCharges.chargesSlabs.find(slab => subtotal <= slab.uptoAmount);
        return matchingSlab ? matchingSlab.charge : 0;
    }



    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });

        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo && (!cartItems[itemId] || cartItems[itemId] === 0)) {
            toast.success("Added to cart", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev, [itemId]: prev[itemId] - 1 };
            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const addToWishlist = async (itemId) => {
        if (!wishlistItems[itemId]) {
            setWishlistItems((prev) => ({ ...prev, [itemId]: 1 }))
            if (token) {
                await axios.post(url + "/api/wishlist/add", { itemId }, { headers: { token } })
            }
        } else {
            setWishlistItems((prev) => {
                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            })
            if (token) {
                await axios.post(url + "/api/wishlist/remove", { itemId }, { headers: { token } })
            }
        }
    }

    const loadWishlistData = async (token) => {
        const response = await axios.post(url + "/api/wishlist/get", {}, { headers: { token } });
        setWishlistItems(response.data.wishlistData);
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                // Check if itemInfo exists to avoid errors if product is deleted
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        if (response.data.success) {
            setCartItems(response.data.cartData || {});
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
                await loadWishlistData(localStorage.getItem("token"));
            } else if (localStorage.getItem("cartItems")) {
                setCartItems(JSON.parse(localStorage.getItem("cartItems")));
            }
            await fetchDeliverySettings();
            await fetchGSTCharges();
        }
        loadData();
    }, [])

    const removeFromCartAll = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            delete updated[itemId];
            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });
        toast.error("Removed from cart", {
            position: "bottom-right",
            autoClose: 2000,
            theme: "light",
        });
        if (token) {
            await axios.post(url + "/api/cart/remove-all", { itemId }, { headers: { token } })
        }
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        removeFromCartAll,
        getTotalCartAmount,
        url,
        token,
        setToken,
        wishlistItems,
        addToWishlist,
        vegOnly,
        setVegOnly,
        nonVegOnly,
        setNonVegOnly,
        showLogin,
        setShowLogin,
        appliedCoupon,
        setAppliedCoupon,
        applyCoupon,
        getDiscountAmount,
        getDeliveryFee,
        deliverySettings,
        gstCharges,
        getGSTAmount,
        getChargesAmount
    }



    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
