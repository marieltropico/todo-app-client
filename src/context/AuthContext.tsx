import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setIsAuthenticated(!!userId);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      await AsyncStorage.setItem('userId', response.data.userId);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await authApi.register(username, password);
      await AsyncStorage.setItem('userId', response.data.userId);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      await AsyncStorage.removeItem('userId');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
