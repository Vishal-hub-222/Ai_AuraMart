import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auramart_user');
    const token = localStorage.getItem('auramart_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('auramart_user');
        localStorage.removeItem('auramart_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('auramart_user', JSON.stringify(res.user));
      localStorage.setItem('auramart_token', res.user.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password, role = 'customer') => {
    const res = await api.register(name, email, password, role);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('auramart_user', JSON.stringify(res.user));
      localStorage.setItem('auramart_token', res.user.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auramart_user');
    localStorage.removeItem('auramart_token');
  };

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [authRole, setAuthRole] = useState('customer');

  const openAuthModal = (customPrompt = '', defaultRole = 'customer') => {
    setAuthPromptMessage(customPrompt);
    setAuthRole(defaultRole);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
    setAuthPromptMessage('');
    setAuthRole('customer');
  };

  const requireAuth = (callback, customPrompt = '') => {
    if (user) {
      if (callback) callback();
      return true;
    }
    openAuthModal(customPrompt);
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthOpen,
        setIsAuthOpen,
        openAuthModal,
        closeAuthModal,
        authPromptMessage,
        authRole,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
