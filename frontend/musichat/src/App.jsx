import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoutes } from "./context/ProtectedRoutes.jsx";

import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import React from 'react';
import './App.css'

function App() {

  return (
    <Router>
      <AuthProvider>
        {/*<NavBar />*/}
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Prevent to route if user is not logged in*/}
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router >
  )

}

export default App
