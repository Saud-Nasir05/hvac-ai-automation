import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. AuthProvider ko import kar
import { AuthProvider } from './context/authcontext'; 

// Layout & Public Pages import
import PublicLayout from './layout/PublicLayout'; 
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// 🔥 NAYA: Dashboard component ko import kiya hai
import Dashboard from './pages/dashboard/Dashboard';

export default function App() {
  return (
    // 🔥 Poori app AuthProvider mein wrap hai
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* 1. Public Website Layout (Jisme Marketing Header/Footer lage hain) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 🔥 2. Vendor Workspace / SaaS Dashboard (Full Screen, No Public Header/Footer) */}
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}