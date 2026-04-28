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
    try {
      if (token) {
        const res = await authService.getCurrentUser();
        setUser(res.user);
        if (res.profile) setProfile(res.profile);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error(err);
      logout();
    }
  }, [token]);

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
    const data = await authService.register({ name, email, password, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (idToken, role) => {
    // Currently fallback since Google auth endpoint isn't fully set up in backend
    // You will need to implement an authService.googleLogin(idToken, role)
    throw new Error("Google login not implemented in backend yet");
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
