import { useState } from 'react';
import { AuthContext } from './authContext.js';

const DEMO_EMAIL = 'demo@legalease.ai';
const DEMO_PASSWORD = 'jwt123';
const DEMO_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AbGVnYWxlYXNlLmFpIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mjg5MDAwMDB9.dummyJwtTokenForDemo';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem('jwtToken') || '';
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStoredToken()));

  const login = async (email, password) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      window.localStorage.setItem('jwtToken', DEMO_TOKEN);
      setIsLoggedIn(true);
      return { success: true };
    }

    if (!AUTH_API_URL) {
      return {
        success: false,
        error: 'Use the demo credentials or configure VITE_AUTH_API_URL for real authentication.',
      };
    }

    try {
      const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || 'Login failed',
        };
      }

      const data = await response.json();

      if (!data.token) {
        return { success: false, error: data.error || 'Login failed' };
      }

      window.localStorage.setItem('jwtToken', data.token);
      setIsLoggedIn(true);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    window.localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

