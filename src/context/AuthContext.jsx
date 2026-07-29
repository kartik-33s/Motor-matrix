import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore authenticated session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('mm_token');
      const storedUser = localStorage.getItem('mm_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('mm_token');
          localStorage.removeItem('mm_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login Handler
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login({ email, password });
      setUser(data.user);
      setToken(data.token);

      localStorage.setItem('mm_token', data.token);
      localStorage.setItem('mm_user', JSON.stringify(data.user));

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to sign in. Please check credentials.';
      setError(message);
      throw new Error(message);
    }
  };

  // Register Handler
  const register = async (name, email, password, role = 'user') => {
    setError(null);
    try {
      const data = await authApi.register({ name, email, password, role });
      setUser(data.user);
      setToken(data.token);

      localStorage.setItem('mm_token', data.token);
      localStorage.setItem('mm_user', JSON.stringify(data.user));

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout Handler
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
