import { createContext, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "https://mihir-backend-ub5m.onrender.com";
    const [token, setToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [role, setRole] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [wishlistItems, setWishlistItems] = useState({});
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [deliverySettings, setDeliverySettings] = useState({ isFreeDelivery: false, slabs: [], distanceSlabs: [], locations: [] });
    const [gstCharges, setGstCharges] = useState({ gstFixedAmount: 0, isGstActive: true, chargesSlabs: [] });
    const [subscriptionPrices, setSubscriptionPrices] = useState([]);
    const [generalSettings, setGeneralSettings] = useState({ 
        isWebsiteOff: false, 
        onlineFrom: "00:00", 
        onlineTo: "23:59" 
    });
    const [heroImages, setHeroImages] = useState([]);
    const [globalPlanConfig, setGlobalPlanConfig] = useState(() => {
        const saved = localStorage.getItem('globalPlanConfig');
        return saved ? JSON.parse(saved) : { orderType: 'today', mealTime: 'Lunch', mealType: 'Veg' };
    });

    const isThali = (item) => {
        if (!item) return false;
        const name = (item.name || "").toLowerCase();
        const category = (item.category || "").toLowerCase();
        return name.includes('thali') || category.includes('thali');
    };

    const getCanonicalName = (item) => {
        if (!item) return null;
        const name = (item.name || "").toLowerCase();
        const category = (item.category || "").toLowerCase();
        
        if (name.includes('thali') || category.includes('thali')) {
             if (name.includes('non-veg') || name.includes('non veg') || category.includes('non-veg')) {
                 return 'Non-Veg Thali';
             }
             return 'Veg Thali';
        }
        return item.name;
    };

    const getCalculatedPrice = (item) => {
        if (!item) return 0;
        const qty = cartItems[item._id] || 0;

        if (!isThali(item) || globalPlanConfig.orderType === 'today') {
            const discount = item.discount || 0;
            return (discount > 0 ? Math.floor(item.price * (1 - discount / 100)) : item.price) * qty;
        }

        // In subscription mode, we don't calculate per-item price here anymore for Thalis
        // as they are replaced by a single subscription price in getTotalCartAmountDynamic
        return 0;
    };

    const getTotalCartAmountDynamic = () => {
        let totalAmount = 0;
        
        if (globalPlanConfig.orderType === 'today') {
            for (const itemId in cartItems) {
                if (cartItems[itemId] > 0) {
                    const itemInfo = (food_list || []).find((product) => product._id === itemId);
                    if (itemInfo) {
                        totalAmount += getCalculatedPrice(itemInfo);
                    }
                }
            }
        } else {
            // Subscription Mode
            // 1. Calculate price for one subscription package
            const matchingRule = (subscriptionPrices || []).find(
                rule => rule.plan === globalPlanConfig.orderType &&
                    rule.mealTiming === globalPlanConfig.mealTime &&
                    rule.mealPreference === globalPlanConfig.mealType
            );

            if (matchingRule) {
                totalAmount = matchingRule.price;
            }

            // 2. Add non-Thali items (addons or other products) if they exist
            // (The user said "replaced by a single Subscription Thali", 
            // but if they have other non-Thali items, we should probably still count them? 
            // Usually, subscription replaces the main thali items.)
            for (const itemId in cartItems) {
                if (cartItems[itemId] > 0) {
                    const itemInfo = (food_list || []).find((product) => product._id === itemId);
                    if (itemInfo && !isThali(itemInfo) && !itemInfo.isComboAddon) {
                        totalAmount += getCalculatedPrice(itemInfo);
                    }
                }
            }
        }
        return totalAmount;
    };


    const applyCoupon = async (couponName) => {
        try {
            const response = await axios.post(url + "/api/coupon/verify", { name: couponName });
            if (response.data.success) {
                setAppliedCoupon(response.data.data);
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: "Error applying coupon" };
        }
    }

    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;

        const cartSubtotal = getTotalCartAmountDynamic();

        if (cartSubtotal === 0) return 0;

        if (appliedCoupon.minOrder && cartSubtotal < appliedCoupon.minOrder) {
            return 0;
        }

        if (appliedCoupon.type === 'percentage') {
            // Apply % discount on the full subtotal
            let discount = Math.floor((cartSubtotal * appliedCoupon.value) / 100);
            if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
                discount = appliedCoupon.maxDiscount;
            }
            return Math.min(discount, cartSubtotal);
        } else if (appliedCoupon.type === 'fixed') {
            // Apply flat discount but cap it at the subtotal
            return Math.min(appliedCoupon.value, cartSubtotal);
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

    const getDeliveryFee = (subtotal, locationName) => {
        if (subtotal === 0) return 0;
        if (deliverySettings.isFreeDelivery) {
            console.log("Delivery Fee: 0 (Free Delivery is ON)");
            return 0;
        }

        // 1. Distance-based calculation (if location is provided)
        if (locationName && deliverySettings.locations && deliverySettings.distanceSlabs) {
            const trimmedLocationName = locationName.trim();
            const location = deliverySettings.locations.find(loc => loc.name && loc.name.trim().toLowerCase() === trimmedLocationName.toLowerCase());
            
            if (location) {
                const distance = Number(location.distance);
                const matchingDistanceSlab = [...deliverySettings.distanceSlabs]
                    .sort((a, b) => Number(a.uptoDistance) - Number(b.uptoDistance))
                    .find(slab => distance <= Number(slab.uptoDistance));
                
                if (matchingDistanceSlab) {
                    console.log(`[StoreContext] Delivery Fee: ${matchingDistanceSlab.deliveryCharge} (Distance: ${distance}km, Slab: ${matchingDistanceSlab.uptoDistance}km, Location: ${location.name})`);
                    return matchingDistanceSlab.deliveryCharge;
                } else {
                    console.warn(`[StoreContext] No distance slab found for ${distance}km`);
                }
            } else {
                console.warn(`[StoreContext] Location '${locationName}' not found in settings. Available:`, deliverySettings.locations.map(l => l.name));
            }
        }

        // 2. Legacy Amount-based fallback
        if (deliverySettings.slabs && deliverySettings.slabs.length > 0) {
            const matchingAmountSlab = [...deliverySettings.slabs]
                .sort((a, b) => Number(a.uptoAmount) - Number(b.uptoAmount))
                .find(slab => subtotal <= Number(slab.uptoAmount));
            if (matchingAmountSlab) {
                console.log(`[StoreContext] Delivery Fee: ${matchingAmountSlab.deliveryCharge} (Amount fallback, Subtotal: ${subtotal})`);
                return matchingAmountSlab.deliveryCharge;
            }
        }

        console.log("[StoreContext] Delivery Fee: 0 (No matching slabs found or default 0 applied)");
        return 0;
    }

    const getMealSlotStatus = (slotType) => {
        if (!generalSettings) return { status: 'loading', message: '' };

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const parseTime = (timeStr) => {
            if (!timeStr) return 0;
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const lunchStart = parseTime(generalSettings.lunchStartTime || "10:00");
        const lunchEnd = parseTime(generalSettings.lunchEndTime || "12:00");
        const dinnerStart = parseTime(generalSettings.dinnerStartTime || "18:00");
        const dinnerEnd = parseTime(generalSettings.dinnerEndTime || "20:00");

        if (slotType === 'Lunch') {
            if (currentTime < lunchStart) return { status: 'upcoming', message: `Ordering starts at ${generalSettings.lunchStartTime || "10:00"}` };
            if (currentTime >= lunchStart && currentTime <= lunchEnd) return { status: 'active', message: `Available till ${generalSettings.lunchEndTime || "12:00"}` };
            return { status: 'expired', message: 'Ordering time is over for this slot' };
        }

        if (slotType === 'Dinner') {
            if (currentTime < dinnerStart) return { status: 'upcoming', message: `Ordering starts at ${generalSettings.dinnerStartTime || "18:00"}` };
            if (currentTime >= dinnerStart && currentTime <= dinnerEnd) return { status: 'active', message: `Available till ${generalSettings.dinnerEndTime || "20:00"}` };
            return { status: 'expired', message: 'Ordering time is over for this slot' };
        }

        return { status: 'unknown', message: '' };
    };

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

        const itemInfo = (food_list || []).find((product) => product._id === itemId);
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
            await axios.post(url + "/api/cart/add", { itemId })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev, [itemId]: prev[itemId] - 1 };

            // If the main item reaches 0, remove all its addons from cart
            if (updated[itemId] <= 0) {
                const addonIds = (food_list || [])
                    .filter(item => item.isComboAddon && item.parentId === itemId)
                    .map(item => item._id);
                addonIds.forEach(addonId => {
                    updated[addonId] = 0;
                });
            }

            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId })
        }
    }

    const addToWishlist = async (itemId) => {
        if (!wishlistItems[itemId]) {
            setWishlistItems((prev) => ({ ...prev, [itemId]: 1 }))
            if (token) {
                await axios.post(url + "/api/wishlist/add", { itemId })
            }
        } else {
            setWishlistItems((prev) => {
                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            })
            if (token) {
                await axios.post(url + "/api/wishlist/remove", { itemId })
            }
        }
    }

    const loadWishlistData = async (token) => {
        try {
            const response = await axios.post(url + "/api/wishlist/get", {});
            if (response.data && response.data.wishlistData) {
                setWishlistItems(response.data.wishlistData);
            }
        } catch (error) {
            console.error("Failed to load wishlist data:", error?.response?.status, error?.message);
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = (food_list || []).find((product) => product._id === item);
                // Check if itemInfo exists to avoid errors if product is deleted
                if (itemInfo) {
                    const discount = itemInfo.discount || 0;
                    const discountedPrice = discount > 0 ? Math.floor(itemInfo.price - (itemInfo.price * discount / 100)) : itemInfo.price;
                    totalAmount += discountedPrice * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        let list = response.data.data || [];
        
        let allItems = [...list];
        list.forEach(item => {
            if (item.addOns && item.addOns.length > 0) {
                item.addOns.forEach(addon => {
                    allItems.push({
                        ...addon,
                        category: "Specific-Addon",
                        isComboAddon: true,
                        parentId: item._id
                    });
                });
            }
        });
        setFoodList(allItems);
    }

    const fetchSubscriptionPrices = async () => {
        try {
            const response = await axios.get(url + "/api/subscription/get");
            if (response.data.success) {
                setSubscriptionPrices(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching subscription prices in StoreContext:", error);
        }
    }

    const fetchGeneralSettings = async () => {
        try {
            const response = await axios.get(url + "/api/settings/get");
            if (response.data.success) {
                setGeneralSettings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching general settings:", error);
        }
    }

    const fetchHeroImages = async () => {
        try {
            const response = await axios.get(url + "/api/hero-image/list");
            if (response.data.success) {
                setHeroImages(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching hero images:", error);
        }
    }


    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {});
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error("Failed to load cart data:", error?.response?.status, error?.message);
            // Fall back to localStorage cart if API fails
            const localCart = localStorage.getItem("cartItems");
            if (localCart) {
                try { setCartItems(JSON.parse(localCart)); } catch (_) {}
            }
        }
    }

    useEffect(() => {
        // Axios interceptor for global Authorization header
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                const tokenInStorage = localStorage.getItem("token");
                if (tokenInStorage && !config.headers.token && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${tokenInStorage}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Axios interceptor for global error handling (Authentication)
        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const storedRefreshToken = localStorage.getItem("refreshToken");
                    
                    if (storedRefreshToken) {
                        try {
                            const res = await axios.post(url + "/api/user/refresh-token", { refreshToken: storedRefreshToken });
                            if (res.data.success) {
                                const newToken = res.data.token;
                                setToken(newToken);
                                localStorage.setItem("token", newToken);
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                return axios(originalRequest);
                            }
                        } catch (refreshError) {
                            console.error("Token refresh failed:", refreshError);
                        }
                    }
                    
                    // If refresh failed or no refresh token, log out
                    setToken("");
                    setRefreshToken("");
                    setRole("");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("role");
                    toast.error("Session expired. Please login again.");
                }
                return Promise.reject(error);
            }
        );

        async function loadData() {
            // Fetch everything in parallel where possible
            const tokenInStorage = localStorage.getItem("token");
            const refreshTokenInStorage = localStorage.getItem("refreshToken");
            const roleInStorage = localStorage.getItem("role");
            
            // Critical setup fetches
            const tasks = [
                fetchHeroImages(),
                fetchGeneralSettings(),
                fetchFoodList(),
                fetchDeliverySettings(),
                fetchGSTCharges(),
                fetchSubscriptionPrices()
            ];

            if (tokenInStorage) {
                setToken(tokenInStorage);
                setRefreshToken(refreshTokenInStorage || "");
                setRole(roleInStorage || "user");
                tasks.push(loadCartData(tokenInStorage));
                tasks.push(loadWishlistData(tokenInStorage));
            } else if (localStorage.getItem("cartItems")) {
                setCartItems(JSON.parse(localStorage.getItem("cartItems")));
            }

            try {
                await Promise.all(tasks);
            } catch (err) {
                console.error("Error during initial data load:", err);
            }
        }
        loadData();

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
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
            await axios.post(url + "/api/cart/remove-all", { itemId })
        }
    }

    const isWithinSchedule = () => {
        const { onlineFrom, onlineTo } = generalSettings;
        if (!onlineFrom || !onlineTo) return true;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [fromH, fromM] = onlineFrom.split(':').map(Number);
        const [toH, toM] = onlineTo.split(':').map(Number);
        
        const fromMinutes = fromH * 60 + fromM;
        const toMinutes = toH * 60 + toM;

        if (fromMinutes <= toMinutes) {
            // Normal range (e.g. 06:00 to 22:00)
            return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
        } else {
            // Overnight range (e.g. 22:00 to 06:00)
            return currentMinutes >= fromMinutes || currentMinutes <= toMinutes;
        }
    };

    const getImageUrl = (image) => {
        const placeholder = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"; // Beautiful Salad
        if (!image) return placeholder;
        
        const img = Array.isArray(image) ? image[0] : image;
        if (!img || typeof img !== 'string') return placeholder;

        const cleanImg = img.trim();

        // Fallback map for legacy missing local images (case-insensitive)
        const legacyFallbacks = {
            'fish_thali_extra.png': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
            'chicken_thali_extra.png': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
            'dal_rice_mini.png': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
            'veg_thali.png': 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80',
            'food_1.png': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
            'food_2.png': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
            'food_3.png': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80'
        };

        if (legacyFallbacks[cleanImg.toLowerCase()]) return legacyFallbacks[cleanImg.toLowerCase()];
        
        // 1. If it's already a full URL (http/https), return it
        if (cleanImg.startsWith("http")) return cleanImg;
        
        // 2. Handle Cloudinary Public IDs
        if (cleanImg.length > 10) {
            const parts = cleanImg.split('/');
            const id = parts[parts.length - 1];
            // Check if it's likely a Cloudinary ID (no dots, and was either in litefood folder or is long)
            if (!id.includes('.') && (cleanImg.startsWith('litefood/') || cleanImg.length > 20)) {
                return `https://res.cloudinary.com/dlv9n7z9l/image/upload/litefood/${id}`;
            }
        }
        
        // 3. Fallback to backend static images
        // If it contains a dot, it's likely a filename
        if (cleanImg.includes('.')) {
            return url + "/images/" + cleanImg;
        }

        // Final safety fallback
        return placeholder;
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        removeFromCartAll,
        getTotalCartAmount: getTotalCartAmountDynamic,
        url,
        token,
        setToken,
        refreshToken,
        setRefreshToken,
        role,
        setRole,
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
        getChargesAmount,
        getMealSlotStatus,
        subscriptionPrices,
        fetchSubscriptionPrices,
        generalSettings,
        heroImages,
        isWithinSchedule: isWithinSchedule(),
        globalPlanConfig,
        setGlobalPlanConfig,
        isThali,
        getCanonicalName,
        getCalculatedPrice,
        getTotalCartAmountDynamic,
        getImageUrl
    }




    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;

