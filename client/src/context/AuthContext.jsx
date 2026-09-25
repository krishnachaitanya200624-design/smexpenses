import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartwealth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartwealth_token'));
  const [loading, setLoading] = useState(true);

  // Sync theme
  useEffect(() => {
    const theme = user?.preferences?.theme || localStorage.getItem('smartwealth_theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

  // Initial user verification
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smartwealth_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('smartwealth_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth Check] Session expired or invalid');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartwealth_token', res.data.token);
      localStorage.setItem('smartwealth_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('smartwealth_token', res.data.token);
      localStorage.setItem('smartwealth_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  // Demo Login helper
  const demoLogin = async () => {
    const demoEmail = 'demo@smartwealth.io';
    const demoPassword = 'password123';
    try {
      return await login(demoEmail, demoPassword);
    } catch (err) {
      // If demo user doesn't exist yet, register it automatically!
      const regRes = await register('Vivek Sharma (Demo User)', demoEmail, demoPassword);
      return regRes;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartwealth_token');
    localStorage.removeItem('smartwealth_user');
  };

  const updateProfile = async (data) => {
    const res = await authApi.updateProfile(data);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('smartwealth_user', JSON.stringify(res.data.user));
      if (data.preferences?.theme) {
        localStorage.setItem('smartwealth_theme', data.preferences.theme);
      }
      return res.data;
    }
  };

  const currencySymbol = user?.preferences?.currencySymbol || '₹';
  const currencyCode = user?.preferences?.currency || 'INR';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        currencySymbol,
        currencyCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
