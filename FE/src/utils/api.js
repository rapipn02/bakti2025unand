import axios from 'axios';

// Base URL sesuai dengan dokumentasi API dan port backend yang sedang berjalan
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Function untuk mendapatkan token dari localStorage
const getToken = () => localStorage.getItem('authToken');

// Buat axios instance
const api = axios.create({
  baseURL: 'https://api-service-930832027948.asia-southeast2.run.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Interceptor untuk menambahkan authorization header pada setiap request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Token expired atau invalid, hapus token dan redirect ke login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Authentication API functions
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};

export const loginWithGoogle = async (userData) => {
  try {
    const response = await api.post('/auth/google-login', userData);
    
    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Google login failed'
      };
    }
  } catch (error) {
    console.error('Google login API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/auth', { name, email, password });
    
    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    }
  } catch (error) {
    console.error('Register API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth');
    
    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to get user data'
      };
    }
  } catch (error) {
    console.error('Get user API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};

export const generateResetCode = async (email) => {
  try {
    const response = await api.post('/auth/generate-code', { email });
    
    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to generate reset code'
      };
    }
  } catch (error) {
    console.error('Generate reset code API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post('/auth/forgotpassword', { 
      email, 
      code, 
      newPassword 
    });
    
    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to reset password'
      };
    }
  } catch (error) {
    console.error('Reset password API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
};
