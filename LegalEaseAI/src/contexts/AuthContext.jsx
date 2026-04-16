import { useEffect, useState } from 'react';
import { AuthContext } from './authContext.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const TOKEN_KEY = 'jwtToken';
const USER_KEY = 'authUser';

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: '', user: null };
  }

  const token = window.localStorage.getItem(TOKEN_KEY) || '';
  const rawUser = window.localStorage.getItem(USER_KEY);

  let user = null;

  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }

  return { token, user };
};

const persistAuth = ({ token, user }) => {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = () => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};

const requestAuth = async (path, payload, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Prioritize the error message from the server, fallback to a descriptive status-based message
      const errorMessage = data.error || `Authentication failed (Server returned ${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please ensure the backend is running.');
    }
    throw error;
  }
};


const verifySession = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Session verification failed');
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const storedAuth = readStoredAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(storedAuth.token));
  const [user, setUser] = useState(storedAuth.user);
  const [authReady, setAuthReady] = useState(!storedAuth.token);

  const completeAuth = (data) => {
    persistAuth({ token: data.token, user: data.user });
    setUser(data.user);
    setIsLoggedIn(true);
    setAuthReady(true);
    return { success: true, user: data.user };
  };

  const login = async (email, password) => {
    try {
      const data = await requestAuth('login', { email, password });
      return completeAuth(data);
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await requestAuth('signup', { name, email, password });
      return completeAuth(data);
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const logout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUser(null);
    setAuthReady(true);
  };

  useEffect(() => {
    let isMounted = true;

    if (!storedAuth.token) {
      setAuthReady(true);
      return () => {
        isMounted = false;
      };
    }

    const validateSession = async () => {
      try {
        const data = await verifySession(storedAuth.token);

        if (!isMounted) {
          return;
        }

        setUser(data.user);
        setIsLoggedIn(true);
      } catch {
        if (!isMounted) {
          return;
        }

        clearAuth();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        if (isMounted) {
          setAuthReady(true);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [storedAuth.token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout, authReady, token: storedAuth.token }}>
      {children}
    </AuthContext.Provider>
  );
};
