import { Navigate, Outlet } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import React, { useContext } from 'react';

export function ProtectedRoutes() {
    const { user } = useContext(AuthContext);
    return user ? <Outlet/> : <Navigate to="/" />;
}