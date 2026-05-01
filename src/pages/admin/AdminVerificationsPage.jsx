import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiCheck, FiX, FiEye, FiHome, FiUsers, FiAlertTriangle, FiCheckCircle, FiAlertTriangle as FiImageError } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';
import { getVerificationImageUrl } from '../../utils/imageHelper';
import toast from 'react-hot-toast';

export default function AdminVerificationsPage() {
  const { t } = useTranslation();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    adminService.getPendingVerifications().then(data => {
      setVerifications(data || []);
      setLoading(false);
    });
  }, []);

  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleApprove = async (id) => {
    try {
      await adminService.reviewVerification(id, 'approve');
      setVerifications(prev => prev.filter(v => v._id !== id));
      toast.success('Owner account verified successfully!');
    } catch (err) { toast.error('Failed to verify'); }
  };

  const handleReject = async (id) => {
    try {
      await adminService.reviewVerification(id, 'reject', 'Invalid documents');
      setVerifications(prev => prev.filter(v => v._id !== id));
      toast.success('Verification rejected.');
    } catch (err) { toast.error('Failed to reject'); }
  };

  const handleImageError = (docId, imageType) => {
    setImageErrors(prev => ({
      ...prev,
      [docId]: { ...prev[docId], [imageType]: true }
    }));
    toast.error(`Failed to load ${imageType} image`);
  };

  const sidebarItems = [
    { to: '/admin', label: t('admin.overview'), icon: <FiHome size={16} /> },
    { to: '/admin/verifications', label: t('admin.verifications'), icon: <FiShield size={16} />, active: true },
    { to: '/admin/users', label: t('admin.users'), icon: <FiUsers size={16} /> },
    { to: '/admin/listings', label: t('admin.listings'), icon: <FiCheckCircle size={16} /> }
  ];

  if (loading) return <div className="loading-screen"><div className="spinner spinner-lg" /></div>;

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
                      <tr key={u._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoc(u)}>
                            <FiEye size={14} /> View Documents
                          </button>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString() || u.submittedAt}</td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(u._id)}><FiCheck size={14} /> Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(u._id)}><FiX size={14} /> Reject</button>
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
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', height: 260, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imageErrors[selectedDoc._id]?.nic ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <FiImageError size={32} style={{ marginBottom: 'var(--space-2)', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Failed to load image</p>
                      </div>
                    ) : (
                      <img 
                        src={getVerificationImageUrl(selectedDoc.nicImage, 'nic')} 
                        alt="National ID Card" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }} 
                        onClick={() => {
                          const url = getVerificationImageUrl(selectedDoc.nicImage, 'nic');
                          if (url && !url.includes('placeholder')) window.open(url, '_blank');
                        }}
                        onError={() => handleImageError(selectedDoc._id, 'nic')}
                        title={selectedDoc.nicImage ? "Click to view full image" : "No image uploaded"} 
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)', margin: 'var(--space-1) 0 0 0' }}>
                    {selectedDoc.nicImage ? 'Image loaded from Cloudinary' : 'Awaiting upload'}
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 14, background: 'var(--primary)', borderRadius: 2 }}></span> Utility Bill
                  </h3>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', height: 260, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imageErrors[selectedDoc._id]?.bill ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <FiImageError size={32} style={{ marginBottom: 'var(--space-2)', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Failed to load image</p>
                      </div>
                    ) : (
                      <img 
                        src={getVerificationImageUrl(selectedDoc.utilityBillImage, 'bill')} 
                        alt="Utility Bill" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }} 
                        onClick={() => {
                          const url = getVerificationImageUrl(selectedDoc.utilityBillImage, 'bill');
                          if (url && !url.includes('placeholder')) window.open(url, '_blank');
                        }}
                        onError={() => handleImageError(selectedDoc._id, 'bill')}
                        title={selectedDoc.utilityBillImage ? "Click to view full image" : "No image uploaded"} 
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)', margin: 'var(--space-1) 0 0 0' }}>
                    {selectedDoc.utilityBillImage ? 'Image loaded from Cloudinary' : 'Awaiting upload'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
                <button className="btn btn-danger" onClick={() => { handleReject(selectedDoc._id); setSelectedDoc(null); }} style={{ minWidth: 100 }}>
                  <FiX size={16} /> Reject
                </button>
                <button className="btn btn-success" onClick={() => { handleApprove(selectedDoc._id); setSelectedDoc(null); }} style={{ minWidth: 140 }}>
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
