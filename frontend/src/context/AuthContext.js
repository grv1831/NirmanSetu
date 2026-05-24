// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('ns_token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobile, password) => {
    const res = await axios.post('/api/auth/login', { mobile, password });
    localStorage.setItem('ns_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.data);
    return res.data.data;
  };

  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    localStorage.setItem('ns_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.data);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('ns_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
