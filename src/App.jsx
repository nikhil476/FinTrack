import React, {useState} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";



function App() {

    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App; 