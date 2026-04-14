import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate JWT API call (replace with your /api/login endpoint)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      // Demo fallback if no backend
      if (email === 'demo@legalease.ai' && password === 'jwt123') {
        const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AbGVnYWxlYXNlLmFpIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mjg5MDAwMDB9.dummyJwtTokenForDemo';
        localStorage.setItem('jwtToken', demoToken);
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

