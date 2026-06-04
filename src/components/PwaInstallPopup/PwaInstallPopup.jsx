import React from 'react';
import './PwaInstallPopup.css';
import { MdAddBox, MdIosShare, MdClose } from 'react-icons/md';

const PwaInstallPopup = ({ show, onClose, onInstall, isIos }) => {
    if (!show) return null;

    return (
        <div className="pwa-install-overlay" onClick={onClose}>
            <div className="pwa-install-popup" onClick={(e) => e.stopPropagation()}>
                <div className="pwa-premium-badge">Exclusive App Feature</div>
                
                <button className="pwa-close-btn" onClick={onClose}>
                    <MdClose size={24} />
                </button>

                <div className="pwa-install-header">
                    <div className="pwa-app-icon-container">
                        <img 
                            src="/pwa-192x192.png" 
                            alt="Flavohub" 
                            className="pwa-app-icon"
                        />
                        <div className="pwa-icon-glow"></div>
                    </div>
                    <div className="pwa-app-info">
                        <h3>Flavohub</h3>
                        <div className="pwa-rating">
                            <span>★★★★★</span>
                            <span className="pwa-rating-count">(4.9)</span>
                        </div>
                        <p>Fast & Fresh Food Delivery</p>
                    </div>
                </div>

                <div className="pwa-install-content">
                    {isIos ? (
                        <div className="pwa-ios-instructions">
                            <p className="pwa-instruction-title">Install on your iPhone</p>
                            <div className="pwa-ios-steps">
                                <div className="pwa-ios-step">
                                    <div className="pwa-step-num">1</div>
                                    <p>Tap the <span className="pwa-icon-box"><MdIosShare size={18} color="#007aff" /></span> icon below</p>
                                </div>
                                <div className="pwa-ios-step">
                                    <div className="pwa-step-num">2</div>
                                    <p>Scroll and tap <strong>Add to Home Screen</strong></p>
                                </div>
                                <div className="pwa-ios-step">
                                    <div className="pwa-step-num">3</div>
                                    <p>Tap <strong>Add</strong> in the top right corner</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="pwa-benefits">
                            <p>Get the best experience with our official app:</p>
                            <ul>
                                <li>🚀 Faster ordering process</li>
                                <li>🔔 Real-time order tracking</li>
                                <li>💎 App-only exclusive discounts</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="pwa-install-actions">
                    {!isIos ? (
                        <button className="pwa-btn-install" onClick={onInstall}>
                            <span>Install Now</span>
                            <MdAddBox size={20} />
                        </button>
                    ) : (
                        <button className="pwa-btn-install" onClick={onClose}>
                            <span>Got it</span>
                        </button>
                    )}
                    <button className="pwa-btn-dismiss" onClick={onClose}>
                        Maybe Later
                    </button>
                </div>
                
                <div className="pwa-popup-footer">
                    100% Secure & Lightweight
                </div>
            </div>
        </div>
    );
};

export default PwaInstallPopup;
