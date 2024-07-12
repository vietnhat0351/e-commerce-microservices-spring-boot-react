import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ roles }) => {
    const { keycloak } = useKeycloak(); // Destructure keycloak directly

    try {
        if (keycloak?.authenticated) { // Check if keycloak is not undefined and authenticated
            const userRoles = keycloak.resourceAccess['e-commerce-backend'].roles;
            if (roles.some(role => userRoles.includes(role))) {
                return <Outlet />;
            } else {
                return <Navigate to="/unauthorized" />;
            }
        } else {
            if (keycloak) { // Check if keycloak is not undefined before calling login
                keycloak.login();
            } else {
                console.error('Keycloak instance is not initialized');
                // Optionally, handle the case where keycloak is not initialized (e.g., redirect to an error page)
            }
        }
    } catch (error) {
        // console.error('Failed to initialize Keycloak');
        // console.error(error);
    }
};

export default ProtectedRoute
