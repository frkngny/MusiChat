import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoutes } from "./utils/ProtectedRoutes.jsx";

import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import RoomPage from './pages/rooms/RoomPage';
import React from 'react';
import './App.css'

function App() {

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    {/* Prevent to route if user is not logged in*/}
                    <Route element={<ProtectedRoutes />}>
                        <Route exact path="/home" element={<HomePage />} />
                        <Route exact path="/room/:roomKey" element={<RoomPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router >
    )
}

export default App
