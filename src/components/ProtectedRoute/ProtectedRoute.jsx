import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useContext(StoreContext);
    const location = useLocation();

    if (!token) {
        // Redirect to login if not authenticated
        // Note: In this app, login is a popup, so we might just redirect home or show the popup
        return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect if role is not allowed
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
