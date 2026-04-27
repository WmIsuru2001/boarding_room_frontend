import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiHome, FiBookOpen, FiImage, FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nicPhoto, setNicPhoto] = useState(null);
  const [nicPreview, setNicPreview] = useState(null);

  const handleNicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNicPhoto(file);
      setNicPreview(URL.createObjectURL(file));
    }
  };

  const removeNic = () => {
    setNicPhoto(null);
    if (nicPreview) URL.revokeObjectURL(nicPreview);
    setNicPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (role === 'owner' && !nicPhoto) {
      toast.error('Please upload your NIC photo for verification');
      return;
    }
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      toast.success(role === 'owner' ? 'Account created! Your verification is pending.' : 'Account created!');
      if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/');
    } catch (err) { toast.error(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center">
          <h1>🎓 {t('auth.registerTitle')}</h1>
          <p className="subtitle">{t('auth.registerSubtitle')}</p>
        </div>
        <div className="role-selector">
          <div className={`role-option ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>
            <div className="role-icon"><FiBookOpen size={24} /></div>
            <div className="role-name">{t('auth.asStudent')}</div>
          </div>
          <div className={`role-option ${role === 'owner' ? 'active' : ''}`} onClick={() => setRole('owner')}>
            <div className="role-icon"><FiHome size={24} /></div>
            <div className="role-name">{t('auth.asOwner')}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><FiUser size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.name')}</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Amila Perera" />
          </div>
          <div className="form-group">
            <label className="form-label"><FiMail size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.email')}</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@esn.ac.lk" />
          </div>
          <div className="form-group">
            <label className="form-label"><FiLock size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.password')}</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label"><FiLock size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.confirmPassword')}</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          
          {role === 'owner' && (
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label">
                <FiImage size={14} style={{ display: 'inline', marginRight: 6 }} />
                Upload NIC Photo (For Verification) *
              </label>
              {!nicPreview ? (
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="nic-upload" 
                    style={{ display: 'none' }}
                    onChange={handleNicChange}
                  />
                  <label 
                    htmlFor="nic-upload"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--bg-tertiary)' }}
                  >
                    <FiUpload size={24} style={{ marginBottom: 'var(--space-2)' }} />
                    <span style={{ fontSize: '0.85rem' }}>Click to upload front of NIC</span>
                  </label>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '150px' }}>
                  <img src={nicPreview} alt="NIC Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <button 
                    type="button"
                    onClick={removeNic}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : t('auth.register')}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {t('auth.hasAccount')} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('auth.login')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
