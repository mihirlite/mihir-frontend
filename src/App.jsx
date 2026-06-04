import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { StoreContext } from './context/StoreContext';
import PwaInstallPopup from './components/PwaInstallPopup/PwaInstallPopup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Lazy loading components for performance
const Home = React.lazy(() => import('./pages/Home/Home'));
const Cart = React.lazy(() => import('./pages/Cart/Cart'));
const PlaceOrder = React.lazy(() => import('./pages/PlaceOrder/PlaceOrder'));
const Verify = React.lazy(() => import('./pages/Verify/Verify'));
const MyOrders = React.lazy(() => import('./pages/MyOrders/MyOrders'));
const TrackOrder = React.lazy(() => import('./pages/TrackOrder/TrackOrder'));
const Admin = React.lazy(() => import('./pages/Admin/Admin'));
const Delivery = React.lazy(() => import('./pages/Delivery/Delivery'));
const Wishlist = React.lazy(() => import('./pages/Wishlist/Wishlist'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword/ResetPassword'));
const Terms = React.lazy(() => import('./pages/Terms/Terms'));
const ReturnPolicy = React.lazy(() => import('./pages/ReturnPolicy/ReturnPolicy'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy/RefundPolicy'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer/Disclaimer'));
const AboutContact = React.lazy(() => import('./pages/AboutContact/AboutContact'));
const ShippingPolicy = React.lazy(() => import('./pages/ShippingPolicy/ShippingPolicy'));
const Success = React.lazy(() => import('./pages/Success/Success'));

// Component lazy loading
const LoginPopup = React.lazy(() => import('./components/LoginPopup/LoginPopup'));
const Footer = React.lazy(() => import('./components/Footer/Footer'));

// Loading Fallback
const LoadingSpinner = () => (
  <div className='fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center'>
    <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
  </div>
);

const App = () => {

  const { showLogin, setShowLogin, generalSettings } = React.useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaPopup, setShowPwaPopup] = useState(false);
  const [isIos, setIsIos] = useState(false);

  React.useEffect(() => {
    // Determine if device is a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Detect if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // 1. Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      // Show iOS popup after 3 seconds for visibility
      const timer = setTimeout(() => setShowPwaPopup(true), 3000);
      return () => clearTimeout(timer);
    }

    // 2. Catch Android/Chrome Prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Only show on mobile devices
      if (!isMobile) return;

      setDeferredPrompt(e);
      // Show popup after 2 seconds if not already installed
      if (!isStandalone) {
        setTimeout(() => setShowPwaPopup(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handlePwaDismiss = () => {
    setShowPwaPopup(false);
  };

  const handlePwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setShowPwaPopup(false);
  };

  const isSystemRoute = location.pathname.startsWith('/master-control-gate') || location.pathname.startsWith('/delivery');
  
  // Dynamic Title Update
  React.useEffect(() => {
    const defaultTitle = "Flavohub | Fast & Fresh Food Delivery";
    const routeTitles = {
      '/': defaultTitle,
      '/cart': 'Your Cart | Flavohub',
      '/order': 'Checkout | Flavohub',
      '/myorders': 'My Orders | Flavohub',
      '/wishlist': 'Your Wishlist | Flavohub',
      '/about-contact': 'About & Contact | Flavohub',
      '/privacy-policy': 'Privacy Policy | Flavohub',
      '/terms': 'Terms of Service | Flavohub',
    };

    if (location.pathname.startsWith('/master-control-gate')) {
      document.title = 'Admin Dashboard | Flavohub';
    } else if (location.pathname.startsWith('/delivery')) {
      document.title = 'Delivery Dashboard | Flavohub';
    } else {
      document.title = routeTitles[location.pathname] || defaultTitle;
    }
  }, [location]);

  const isOffline = generalSettings.isWebsiteOff;

  return (
    <>
      {!isSystemRoute && isOffline && (
        <div className='fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center text-center p-6 animate-fadeIn'>
          <div className='max-w-md'>
            <div className='w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl'>
              🏡
            </div>
            <h1 className='text-3xl font-black text-[#323232] mb-4'>Currently Resting</h1>
            <p className='text-gray-500 font-medium mb-8 leading-relaxed'>
              We're currently taking a short break to refresh our kitchen.
              {generalSettings.onlineFrom && generalSettings.onlineTo && (
                <> We are online daily from <span className='text-orange-600 font-bold'>{generalSettings.onlineFrom}</span> to <span className='text-orange-600 font-bold'>{generalSettings.onlineTo}</span>. </>
              )}
              We'll be back soon to serve you your favorite flavors!
            </p>
            <div className='inline-block px-6 py-2 bg-orange-50 text-orange-600 rounded-full font-bold border border-orange-100'>
              Stay tuned!
            </div>
          </div>
        </div>
      )}
      <React.Suspense fallback={<LoadingSpinner />}>
        {showLogin ? <LoginPopup /> : <></>}
        {!isSystemRoute && <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        <div className='app'>
          <ToastContainer />
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <PlaceOrder />
              </ProtectedRoute>
            } />
            <Route path='/verify' element={<Verify />} />
            <Route path='/success' element={<Success />} />
            <Route path='/myorders' element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path='/track-order/:orderId' element={<TrackOrder />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/return-policy' element={<ReturnPolicy />} />
            <Route path='/refund-policy' element={<RefundPolicy />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/disclaimer' element={<Disclaimer />} />
            <Route path='/about-contact' element={<AboutContact />} />
            <Route path='/shipping-policy' element={<ShippingPolicy />} />
            <Route path='/master-control-gate/*' element={<Admin />} />
            <Route path='/delivery/*' element={
              <ProtectedRoute allowedRoles={['delivery', 'admin']}>
                <Delivery />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        {!isSystemRoute && <Footer />}
      </React.Suspense>
      <PwaInstallPopup 
        show={showPwaPopup} 
        onClose={handlePwaDismiss} 
        onInstall={handlePwaInstall}
        isIos={isIos}
      />
    </>
  )
}

export default App
