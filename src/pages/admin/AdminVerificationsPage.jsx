import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiCheck, FiX, FiEye, FiHome, FiUsers, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function AdminVerificationsPage() {
  const { t } = useTranslation();
  const [verifications, setVerifications] = useState([
    { id: 1, name: 'Amila Perera', email: 'amila@example.com', role: 'owner', document: 'NIC & Utility Bill', submittedAt: '2026-04-26', nicImg: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400', billImg: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400' },
    { id: 2, name: 'Sunil Shantha', email: 'sunil@example.com', role: 'owner', document: 'NIC & Utility Bill', submittedAt: '2026-04-27', nicImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', billImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400' },
  ]);

  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleApprove = (id) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    toast.success('Owner account verified successfully!');
  };

  const handleReject = (id) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    toast.success('Verification rejected.');
  };

  const sidebarItems = [
    { to: '/admin', label: t('admin.overview'), icon: <FiHome size={16} /> },
    { to: '/admin/verifications', label: t('admin.verifications'), icon: <FiShield size={16} />, active: true },
    { to: '/admin/users', label: t('admin.users'), icon: <FiUsers size={16} /> },
    { to: '/admin/listings', label: t('admin.listings'), icon: <FiCheckCircle size={16} /> },
    { to: '/admin/reports', label: t('admin.reports'), icon: <FiAlertTriangle size={16} /> },
    { to: '/admin/universities', label: t('admin.universities'), icon: <FiHome size={16} /> },
  ];

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}>🛡️ {t('admin.dashboard')}</h1>
        
        <div className="admin-layout">
          <nav className="admin-sidebar">
            {sidebarItems.map(item => (
              <Link key={item.to} to={item.to} className={`sidebar-item ${item.active ? 'active' : ''}`}>{item.icon} {item.label}</Link>
            ))}
          </nav>
          
          <div className="admin-content">
            <h2 style={{ fontWeight: 700, marginBottom: 'var(--space-6)' }}>Pending Owner Verifications</h2>
            
            {verifications.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
                <FiShield size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
                <p>No pending verifications at the moment.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Owner Info</th><th>Documents</th><th>Submitted</th><th>Actions</th></tr></thead>
                  <tbody>
                    {verifications.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoc(u)}>
                            <FiEye size={14} /> View Documents
                          </button>
                        </td>
                        <td>{u.submittedAt}</td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(u.id)}><FiCheck size={14} /> Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(u.id)}><FiX size={14} /> Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="modal-overlay" onClick={() => setSelectedDoc(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 'var(--space-4)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="card" style={{ maxWidth: 750, width: '100%', maxHeight: '85vh', overflowY: 'auto', background: 'var(--bg-primary)', padding: 'var(--space-6)' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>Review Verification Documents</h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Owner: {selectedDoc.name}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => setSelectedDoc(null)} style={{ alignSelf: 'flex-start' }}><FiX size={20} /></button>
              </div>
              
              <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 14, background: 'var(--primary)', borderRadius: 2 }}></span> National ID Card
                  </h3>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', height: 260, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <img src={selectedDoc.nicImg} alt="NIC" style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }} onClick={() => window.open(selectedDoc.nicImg, '_blank')} title="Click to view full image" />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 14, background: 'var(--primary)', borderRadius: 2 }}></span> Utility Bill
                  </h3>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', height: 260, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <img src={selectedDoc.billImg} alt="Utility Bill" style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }} onClick={() => window.open(selectedDoc.billImg, '_blank')} title="Click to view full image" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
                <button className="btn btn-danger" onClick={() => { handleReject(selectedDoc.id); setSelectedDoc(null); }} style={{ minWidth: 100 }}>
                  <FiX size={16} /> Reject
                </button>
                <button className="btn btn-success" onClick={() => { handleApprove(selectedDoc.id); setSelectedDoc(null); }} style={{ minWidth: 140 }}>
                  <FiCheck size={16} /> Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
