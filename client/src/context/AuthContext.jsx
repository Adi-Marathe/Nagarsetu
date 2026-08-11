import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { authAPI } from '../services/api';

const AuthContext = createContext();

// ─── Auth Provider ───────────────────────────────────────────
// Uses the centralized API client from services/api.js.
// No hardcoded URLs — everything flows through the shared Axios instance
// which reads VITE_API_URL from the environment.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const data = res.data;
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const data = res.data;
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isOfficer = () => user?.role === 'officer';
  const isCitizen = () => user?.role === 'citizen';

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      isAdmin, isOfficer, isCitizen, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
