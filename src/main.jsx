import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <GoogleOAuthProvider clientId="323158490520-7ebsu0vhsqo2qv8u7ihqct2v594ik3vf.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StoreContextProvider>
  </BrowserRouter>,
)
