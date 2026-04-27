import { useState, useEffect } from 'react';
import { FiCheckCircle, FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminListingsPage() {
  const { t } = useTranslation();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminService.getPendingVerifications().then(data => { setPending(data); setLoading(false); }); }, []);

  const handleApprove = async (id) => {
    await adminService.approveListing(id);
    setPending(prev => prev.filter(l => l.id !== id));
    toast.success('Listing approved!');
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}><FiCheckCircle style={{ display: 'inline' }} /> {t('admin.listings')} - Pending Approval</h1>
        {pending.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">✅</div><h3>No pending listings</h3><p>All listings have been reviewed</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Title</th><th>Price</th><th>Owner</th><th>Actions</th></tr></thead>
            <tbody>
              {pending.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.title}</td>
                  <td>Rs. {l.price?.toLocaleString()}</td>
                  <td>{l.ownerId}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => handleApprove(l.id)}><FiCheck size={14} /> {t('admin.approve')}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { setPending(p => p.filter(x => x.id !== l.id)); toast.success('Rejected'); }}><FiX size={14} /> {t('admin.reject')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
