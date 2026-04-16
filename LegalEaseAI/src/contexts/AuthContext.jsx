import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
          setIsLoggedIn(true);
        }
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        setUser(jwtDecode(data.token));
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: 'Network error. Backend might be down.' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        setUser(jwtDecode(data.token));
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Signup failed' };
    } catch (err) {
      return { success: false, error: 'Network error. Backend might be down.' };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        setUser(jwtDecode(data.token));
        setIsLoggedIn(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Google Login failed' };
    } catch (err) {
      return { success: false, error: 'Network error. Backend might be down.' };
    }
  }

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

