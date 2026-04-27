import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const reports = [
    { id: 1, reporter: 'Amila Perera', target: 'Budget Room in Kohuwala', type: 'listing', reason: 'fake_listing', status: 'pending', date: '2026-04-18' },
    { id: 2, reporter: 'Nimal Silva', target: 'Anonymous User', type: 'user', reason: 'harassment', status: 'pending', date: '2026-04-20' },
  ];
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}><FiAlertTriangle style={{ display: 'inline' }} /> {t('admin.reports')}</h1>
        <table className="data-table">
          <thead><tr><th>Reporter</th><th>Target</th><th>Type</th><th>Reason</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.reporter}</td>
                <td style={{ fontWeight: 600 }}>{r.target}</td>
                <td><span className="badge badge-outline">{r.type}</span></td>
                <td>{r.reason.replace('_', ' ')}</td>
                <td>{r.date}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => toast.success('Resolved')}><FiCheck size={14} /> {t('admin.resolve')}</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Dismissed')}><FiX size={14} /> {t('admin.dismiss')}</button>
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
