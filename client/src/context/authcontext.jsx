import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check kar rahe hain ke backend zinda hai aur user logged in hai ya nahi
    const checkAuthStatus = async () => {
      try {
        const { data } = await api.get('/user/me');
        if (data.success) {
          setUser(data.user);
          console.log("✅ Backend Connected! Logged in Vendor:", data.user.company_name);
        }
      } catch (error) {
        console.log("⚡ Backend Connected, lekin user logged out hai.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/user/login', { email, password });
      if (data.success) {
        setUser(data.responseData.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await api.get('/user/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);