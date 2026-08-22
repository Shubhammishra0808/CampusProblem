import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusfix_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusfix_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem('campusfix_token');
      const savedUserStr = localStorage.getItem('campusfix_user');

      if (storedToken && savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          setUser(parsedUser);
          setToken(storedToken);

          const res = await api.get('/auth/me');
          if (res?.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session check fallback to cached user:', err);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      localStorage.setItem('campusfix_token', res.data.token);
      localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const sendOTP = async (phone, role = 'student') => {
    const res = await api.post('/auth/send-otp', { phone, role });
    return res.data;
  };

  const loginWithOTP = async (phone, otp, role = 'student') => {
    const res = await api.post('/auth/verify-otp', { phone, otp, role });
    if (res.data && res.data.success) {
      localStorage.setItem('campusfix_token', res.data.token);
      localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (userData, autoLogin = true) => {
    const res = await api.post('/auth/register', userData);
    if (res.data && res.data.success && autoLogin) {
      localStorage.setItem('campusfix_token', res.data.token);
      localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campusfix_token');
    localStorage.removeItem('campusfix_user');
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campusfix_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        sendOTP,
        loginWithOTP,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
