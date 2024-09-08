import { Navigate, Outlet } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import React, { useContext, useLayoutEffect, useState } from 'react';
import dayjs from "dayjs";
import NavBar from "../components/NavBar";
import useAxios from "../hooks/useAxios";

export function ProtectedRoutes() {
    const { user } = useContext(AuthContext);
    const [userObject, setUserObject] = useState(null)
    const axios = useAxios();
    
    useLayoutEffect(() => {
        axios.get('/users/me').then((resp) => {
            setUserObject(resp.data);
        });
    }, []);

    return user && dayjs.unix(user.exp).diff(dayjs()) >= 1 ?
        <>
            <NavBar userObject={userObject}/>
            <Outlet userObject={userObject}/>
        </>
        :
        <Navigate to="/" />;
}