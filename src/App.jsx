import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import TrackOrder from './pages/TrackOrder/TrackOrder'
import Admin from './pages/Admin/Admin'
import Wishlist from './pages/Wishlist/Wishlist'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {!isAdminRoute && <Navbar setShowLogin={setShowLogin} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      <div className='app'>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/track-order/:orderId' element={<TrackOrder />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
