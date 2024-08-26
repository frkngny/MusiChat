import { Navigate, Outlet } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import React, { useContext } from 'react';
import dayjs from "dayjs";

export function ProtectedRoutes() {
    const { user } = useContext(AuthContext);
    return user && dayjs.unix(user.exp).diff(dayjs()) >= 1 ? <Outlet/> : <Navigate to="/" />;
}