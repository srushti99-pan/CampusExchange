import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (signUpData) => {
    await api.post('/auth/register', signUpData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfileState = (newProfileData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = {
        ...prevUser,
        name: newProfileData.name,
        college: newProfileData.college,
      };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfileState,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes('ROLE_ADMIN') || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
