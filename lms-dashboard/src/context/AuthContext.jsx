import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [user]);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Please provide both email and password');
      }

      const response = await api.login({ email, password });
      const userData = response.data;

      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      const newUser = response.data;

      setUser(newUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.updateProfile(profileData);
      const updatedUser = response.data;

      setUser(prev => ({ ...prev, ...updatedUser }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Profile update failed',
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;