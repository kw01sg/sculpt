import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';
import { UserLogin, UserRegister, AuthResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user", error);
          logout(); // If token is invalid, logout
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = async (credentials: UserLogin) => {
    const response: AuthResponse = await loginUser(credentials);
    localStorage.setItem('token', response.access_token);
    setToken(response.access_token);
    const userData = await getMe();
    setUser(userData);
  };

  const register = async (userData: UserRegister) => {
    await registerUser(userData);
    // After registration, log them in
    await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
