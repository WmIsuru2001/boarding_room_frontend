import { motion } from 'framer-motion';
import { FiMapPin, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { universities } from '../../mockData/mockDb';
import toast from 'react-hot-toast';

export default function AdminUniversitiesPage() {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}><FiMapPin style={{ display: 'inline' }} /> {t('admin.universities')}</h1>
          <button className="btn btn-primary" onClick={() => toast.success('Add university form')}><FiPlus size={14} /> Add University</button>
        </div>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Short Name</th><th>Domain</th><th>Coordinates</th><th>Actions</th></tr></thead>
          <tbody>
            {universities.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td><span className="badge badge-primary">{u.shortName}</span></td>
                <td>{u.domain}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.location.coordinates[1].toFixed(4)}, {u.location.coordinates[0].toFixed(4)}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm"><FiEdit size={14} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}><FiTrash2 size={14} /></button>
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
