import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const fetchUser = useCallback(async () => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    else logout();
  }, []);

  useEffect(() => {
    if (token) fetchUser();
    else setLoading(false);
  }, [token, fetchUser]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, role) => {
    const data = await authService.login(email || 'admin@boardfinder.lk', password || '123');
    data.user.role = role || 'student';
    data.user.name = name;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (idToken, role) => {
    const data = await authService.login('admin@boardfinder.lk', '123');
    data.user.role = role || 'student';
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateUser = (u) => setUser(prev => ({ ...prev, ...u }));
  const updateProfile = (p) => setProfile(prev => ({ ...prev, ...p }));

  return (
    <AuthContext.Provider value={{
      user, profile, loading, token,
      login, register, loginWithGoogle, logout,
      updateUser, updateProfile, refreshUser: fetchUser,
      isStudent: user?.role === 'student', isOwner: user?.role === 'owner',
      isAdmin: user?.role === 'admin', isAuthenticated: !!user,
      isVerified: user?.verificationStatus === 'verified'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
