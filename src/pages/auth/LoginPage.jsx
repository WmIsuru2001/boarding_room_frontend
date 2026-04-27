import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const quickLogin = async (role) => {
    const emails = { student: 'amila.p@esn.ac.lk', owner: 'kamal.silva@example.com', admin: 'admin@boardfinder.lk' };
    setEmail(emails[role]); setPassword('123');
    try {
      const user = await login(emails[role], '123');
      toast.success(`Logged in as ${role}`);
      if (role === 'admin') navigate('/admin');
      else if (role === 'owner') navigate('/owner/dashboard');
      else navigate('/');
    } catch (err) { toast.error('Login failed'); }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center">
          <h1>🎓 {t('auth.loginTitle')}</h1>
          <p className="subtitle">{t('auth.loginSubtitle')}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><FiMail size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.email')}</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@esn.ac.lk" />
          </div>
          <div className="form-group">
            <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}><FiLock size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.password')}</label>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{t('auth.forgotPassword')}</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : t('auth.login')}</button>
        </form>
        <div className="auth-divider">{t('auth.orContinueWith')}</div>
        <button className="google-btn" onClick={() => quickLogin('student')}>🔑 Quick Login as Student</button>
        <div className="flex gap-2" style={{ marginTop: 'var(--space-3)' }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickLogin('owner')}>Owner Login</button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => quickLogin('admin')}>Admin Login</button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {t('auth.noAccount')} <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('auth.register')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
