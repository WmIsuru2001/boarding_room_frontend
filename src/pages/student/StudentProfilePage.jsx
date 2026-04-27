import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [maxBudget, setMaxBudget] = useState(25000);
  const [prefDistance, setPrefDistance] = useState(3);

  const handleSave = () => toast.success('Profile updated!');

  return (
    <div className="page-container" style={{ maxWidth: 700, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}><FiUser style={{ display: 'inline' }} /> {t('nav.profile')}</h1>
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="avatar avatar-lg flex items-center justify-center" style={{ fontSize: '1.5rem' }}>{user?.name?.charAt(0)}</div>
            <div><h3 style={{ fontWeight: 700 }}>{user?.name}</h3><p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</p><span className="badge badge-primary" style={{ marginTop: 4 }}>{user?.role}</span></div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.name')}</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.phone')}</label>
            <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77 123 4567" />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Max Budget (LKR)</label>
              <input className="form-input" type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Max Distance (km)</label>
              <input className="form-input" type="number" value={prefDistance} onChange={e => setPrefDistance(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSave}><FiSave size={16} /> Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
