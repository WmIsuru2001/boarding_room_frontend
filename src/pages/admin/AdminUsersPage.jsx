import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiSlash } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { users } from '../../mockData/mockDb';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}><FiUsers style={{ display: 'inline' }} /> {t('admin.users')}</h1>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name || `${u.firstName} ${u.lastName}`}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'owner' ? 'badge-warning' : 'badge-outline'}`}>{u.role}</span></td>
                <td>{u.isVerified ? <span className="badge badge-verified"><FiShield size={10} /> Verified</span> : <span className="badge badge-outline">Unverified</span>}</td>
                <td>{u.role !== 'admin' && <button className="btn btn-danger btn-sm" onClick={() => toast.success('User banned')}><FiSlash size={12} /> {t('admin.ban')}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
