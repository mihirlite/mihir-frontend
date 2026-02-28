import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [wishlistItems, setWishlistItems] = useState({});
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    const [showLogin, setShowLogin] = useState(false);



    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
            localStorage.setItem("cartItems", JSON.stringify(updated));
            return updated;
        });
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
        }
        loadData();
    }, [])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
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
        setShowLogin
    }



    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
