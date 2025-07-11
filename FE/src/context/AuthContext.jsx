import React, { createContext, useContext, useState, useEffect } from 'react';

// Membuat context
const AuthContext = createContext();
const API_BASE_URL = "https://api-service-930832027948.asia-southeast2.run.app"
// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk login
  const login = async (credentials) => {
    try {
      // Login dengan API backend yang benar - gunakan prefix /auth
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 200) {
          const userData = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            image: data.data.image
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Simpan token dan user data
          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }
          localStorage.setItem('user', JSON.stringify(userData));
          
          return { success: true, user: userData };
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Fungsi untuk register
  const register = async (userData) => {
    try {
      // Kirim confirmPassword ke backend
      const payload = {
        ...userData,
        confirmPassword: userData.confirmPassword || userData.password
      };
      const response = await fetch(`${API_BASE_URL}/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Fungsi untuk Google Login
  const googleLogin = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 200) {
          setUser(data.data);
          setIsAuthenticated(true);
          if (data.token) localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.data));
          return { success: true, data: data.data };
        } else {
          throw new Error(data.message || 'Google login failed');
        }
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Parse user data dari localStorage
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth parsing error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
