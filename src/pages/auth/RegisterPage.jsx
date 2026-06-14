import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiHome, FiBookOpen, FiEye, FiEyeOff, FiHash, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import FullPageLoader from '../../components/layout/FullPageLoader';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

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
  
  const [campusRegNo, setCampusRegNo] = useState('');
  const [studentIdFront, setStudentIdFront] = useState(null);
  const [studentIdBack, setStudentIdBack] = useState(null);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (fieldName, value, allValues = {}) => {
    const errorMsg = {};

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errorMsg.name = 'Name is required';
        } else if (value.trim().length < 3) {
          errorMsg.name = 'Name must be at least 3 characters';
        } else if (value.trim().length > 50) {
          errorMsg.name = 'Name must not exceed 50 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          errorMsg.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        break;

      case 'email':
        if (!value.trim()) {
          errorMsg.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg.email = 'Please enter a valid email address';
        } else if (value.length > 100) {
          errorMsg.email = 'Email is too long';
        }
        break;

      case 'password':
        if (!value) {
          errorMsg.password = 'Password is required';
        } else if (value.length < 8) {
          errorMsg.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(value)) {
          errorMsg.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          errorMsg.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(value)) {
          errorMsg.password = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
          errorMsg.password = 'Password must contain at least one special character (!@#$%^&*)';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errorMsg.confirmPassword = 'Please confirm your password';
        } else if (value !== (allValues.password || password)) {
          errorMsg.confirmPassword = 'Passwords do not match';
        }
        break;

      case 'campusRegNo':
        if (role === 'student' && !value.trim()) {
          errorMsg.campusRegNo = 'Campus registration number is required for students';
        } else if (value && !/^[a-zA-Z0-9/]+$/.test(value)) {
          errorMsg.campusRegNo = 'Invalid campus registration number format';
        }
        break;

      case 'studentIdFront':
        if (role === 'student' && !value) {
          errorMsg.studentIdFront = 'Student ID front photo is required';
        } else if (value && value.size > 5 * 1024 * 1024) {
          errorMsg.studentIdFront = 'Image size must be less than 5MB';
        } else if (value && !['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)) {
          errorMsg.studentIdFront = 'Only JPG and PNG images are allowed';
        }
        break;

      case 'studentIdBack':
        if (role === 'student' && !value) {
          errorMsg.studentIdBack = 'Student ID back photo is required';
        } else if (value && value.size > 5 * 1024 * 1024) {
          errorMsg.studentIdBack = 'Image size must be less than 5MB';
        } else if (value && !['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)) {
          errorMsg.studentIdBack = 'Only JPG and PNG images are allowed';
        }
        break;

      default:
        break;
    }

    return errorMsg;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    // Validate basic fields
    newErrors = { ...newErrors, ...validateField('name', name) };
    newErrors = { ...newErrors, ...validateField('email', email) };
    newErrors = { ...newErrors, ...validateField('password', password) };
    newErrors = { ...newErrors, ...validateField('confirmPassword', confirmPassword) };

    // Validate student-specific fields
    if (role === 'student') {
      newErrors = { ...newErrors, ...validateField('campusRegNo', campusRegNo) };
      newErrors = { ...newErrors, ...validateField('studentIdFront', studentIdFront) };
      newErrors = { ...newErrors, ...validateField('studentIdBack', studentIdBack) };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouched({ ...touched, [fieldName]: true });
    const fieldErrors = validateField(fieldName, eval(fieldName));
    setErrors({ ...errors, ...fieldErrors });
  };

  // Reset student-specific fields when role changes
  useEffect(() => {
    if (role === 'owner') {
      // Clear student-specific errors when switching to owner
      const { campusRegNo, studentIdFront, studentIdBack, ...otherErrors } = errors;
      setErrors(otherErrors);
      setTouched({ ...touched, campusRegNo: false, studentIdFront: false, studentIdBack: false });
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate entire form
    if (!validateForm()) {
      toast.error('Please fix all validation errors');
      return;
    }

    setLoading(true);
    try {
      let payload;
      if (role === 'student') {
        payload = new FormData();
        payload.append('name', name);
        payload.append('email', email);
        payload.append('password', password);
        payload.append('role', role);
        if (campusRegNo) payload.append('campusRegistrationNumber', campusRegNo);
        if (studentIdFront) payload.append('studentIdFront', studentIdFront);
        if (studentIdBack) payload.append('studentIdBack', studentIdBack);
      } else {
        payload = { name, email, password, role };
      }

      const user = await register(payload);
      toast.success(role === 'owner' ? 'Account created! Please verify your identity.' : 'Account created!');
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
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label className="form-label"><FiUser size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.name')}</label>
            <input 
              className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`} 
              value={name} 
              onChange={e => {
                setName(e.target.value);
                if (touched.name) {
                  const fieldErrors = validateField('name', e.target.value);
                  setErrors({ ...errors, ...fieldErrors });
                }
              }} 
              onBlur={() => handleBlur('name')}
              placeholder="Amila Perera" 
              autoComplete="new-password" 
            />
            {errors.name && touched.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label"><FiMail size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.email')}</label>
            <input 
              className={`form-input ${errors.email && touched.email ? 'input-error' : ''}`} 
              type="email" 
              value={email} 
              onChange={e => {
                setEmail(e.target.value);
                if (touched.email) {
                  const fieldErrors = validateField('email', e.target.value);
                  setErrors({ ...errors, ...fieldErrors });
                }
              }} 
              onBlur={() => handleBlur('email')}
              placeholder="you@esn.ac.lk" 
              autoComplete="new-password" 
            />
            {errors.email && touched.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label"><FiLock size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.password')}</label>
            <div style={{ position: 'relative' }}>
              <input 
                className={`form-input ${errors.password && touched.password ? 'input-error' : ''}`} 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    const fieldErrors = validateField('password', e.target.value);
                    setErrors({ ...errors, ...fieldErrors });
                  }
                }} 
                onBlur={() => handleBlur('password')}
                placeholder="••••••••" 
                autoComplete="new-password" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && touched.password && <p className="error-message">{errors.password}</p>}
            {password && !errors.password && touched.password && (
              <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>✓ Password is strong</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label"><FiLock size={14} style={{ display: 'inline', marginRight: 6 }} />{t('auth.confirmPassword')}</label>
            <div style={{ position: 'relative' }}>
              <input 
                className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`} 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) {
                    const fieldErrors = validateField('confirmPassword', e.target.value);
                    setErrors({ ...errors, ...fieldErrors });
                  }
                }} 
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••" 
                autoComplete="new-password" 
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            {confirmPassword && password === confirmPassword && !errors.confirmPassword && touched.confirmPassword && (
              <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>✓ Passwords match</p>
            )}
          </div>
          
          {role === 'student' && (
            <>
              <div className="form-group">
                <label className="form-label"><FiHash size={14} style={{ display: 'inline', marginRight: 6 }} />Campus Registration Number</label>
                <input 
                  className={`form-input ${errors.campusRegNo && touched.campusRegNo ? 'input-error' : ''}`} 
                  value={campusRegNo} 
                  onChange={e => {
                    setCampusRegNo(e.target.value);
                    if (touched.campusRegNo) {
                      const fieldErrors = validateField('campusRegNo', e.target.value);
                      setErrors({ ...errors, ...fieldErrors });
                    }
                  }} 
                  onBlur={() => handleBlur('campusRegNo')}
                  placeholder="EUSL/TC/IS/2020/COM/101" 
                />
                {errors.campusRegNo && touched.campusRegNo && <p className="error-message">{errors.campusRegNo}</p>}
              </div>
              <div className="form-group">
                <label className="form-label"><FiImage size={14} style={{ display: 'inline', marginRight: 6 }} />Student ID Front Photo</label>
                <input 
                  className={`form-input ${errors.studentIdFront && touched.studentIdFront ? 'input-error' : ''}`} 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    setStudentIdFront(e.target.files[0]);
                    if (touched.studentIdFront) {
                      const fieldErrors = validateField('studentIdFront', e.target.files[0]);
                      setErrors({ ...errors, ...fieldErrors });
                    }
                  }} 
                  onBlur={() => handleBlur('studentIdFront')}
                />
                {errors.studentIdFront && touched.studentIdFront && <p className="error-message">{errors.studentIdFront}</p>}
                {studentIdFront && !errors.studentIdFront && touched.studentIdFront && (
                  <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>✓ {studentIdFront.name}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label"><FiImage size={14} style={{ display: 'inline', marginRight: 6 }} />Student ID Back Photo</label>
                <input 
                  className={`form-input ${errors.studentIdBack && touched.studentIdBack ? 'input-error' : ''}`} 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    setStudentIdBack(e.target.files[0]);
                    if (touched.studentIdBack) {
                      const fieldErrors = validateField('studentIdBack', e.target.files[0]);
                      setErrors({ ...errors, ...fieldErrors });
                    }
                  }} 
                  onBlur={() => handleBlur('studentIdBack')}
                />
                {errors.studentIdBack && touched.studentIdBack && <p className="error-message">{errors.studentIdBack}</p>}
                {studentIdBack && !errors.studentIdBack && touched.studentIdBack && (
                  <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>✓ {studentIdBack.name}</p>
                )}
              </div>
            </>
          )}
          
          <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ marginTop: 'var(--space-4)' }}>{loading ? 'Creating...' : t('auth.register')}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {t('auth.hasAccount')} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('auth.login')}</Link>
        </p>
      </motion.div>

      {/* Full-page loader during registration */}
      <FullPageLoader 
        isVisible={loading} 
        message="Creating your account..." 
        blur={true}
      />
    </div>
  );
}
