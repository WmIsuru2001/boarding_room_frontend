import { motion } from 'framer-motion';
import { FiShield, FiCheck, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function AdminVerificationsPage() {
  const { t } = useTranslation();
  const mockPending = [
    { id: 1, name: 'Suresh Kumar', email: 'suresh@example.com', role: 'owner', document: 'National ID', submittedAt: '2026-04-20' },
    { id: 2, name: 'Priya Nair', email: 'priya@example.com', role: 'owner', document: 'Utility Bill', submittedAt: '2026-04-22' },
  ];
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}><FiShield style={{ display: 'inline' }} /> {t('admin.verifications')}</h1>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Document</th><th>Submitted</th><th>Actions</th></tr></thead>
          <tbody>
            {mockPending.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-outline">{u.document}</span></td>
                <td>{u.submittedAt}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => toast.success('Approved!')}><FiCheck size={14} /> {t('admin.approve')}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => toast.success('Rejected')}><FiX size={14} /> {t('admin.reject')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
