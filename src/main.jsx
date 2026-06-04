import React from 'react'
import * as Sentry from "@sentry/react";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker
registerSW({ immediate: true })

// Initialize Sentry
if (import.meta.env.VITE_SENTRY_DSN && !import.meta.env.VITE_SENTRY_DSN.includes('your-frontend-sentry-dsn')) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Tracing
    tracesSampleRate: 1.0, // Capture 100% of the transactions (Reduce in production)
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample rate at 10%.
    replaysOnErrorSampleRate: 1.0, // Sample rate at 100% on errors.
  });
} else {
  console.warn("Sentry DSN is missing or is a placeholder. Sentry is disabled on the frontend.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <StoreContextProvider>
      <GoogleOAuthProvider clientId="110760596427-e8sio4in6t5v4sorgsamb4ouqnhe91re.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StoreContextProvider>
  </BrowserRouter>
  </React.StrictMode>,
)
