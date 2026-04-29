import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiCheck, FiX, FiHome, FiShield, FiUsers, FiAlertTriangle, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageHelper';

export default function AdminListingsPage() {
  const { t } = useTranslation();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => { 
    adminService.getPendingListings().then(data => { 
      setPending(data || []);
      setLoading(false); 
    }); 
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.reviewListing(id, 'approve', 'Looks good');
      setPending(prev => prev.filter(l => l._id !== id));
      setSelectedListing(null);
      toast.success('Listing approved and is now public!');
    } catch (err) {
      toast.error('Failed to approve listing');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.reviewListing(id, 'reject', 'Does not meet guidelines');
      setPending(prev => prev.filter(l => l._id !== id));
      setSelectedListing(null);
      toast.success('Listing rejected.');
    } catch (err) {
      toast.error('Failed to reject listing');
    }
  };

  const sidebarItems = [
    { to: '/admin', label: t('admin.overview'), icon: <FiHome size={16} /> },
    { to: '/admin/verifications', label: t('admin.verifications'), icon: <FiShield size={16} /> },
    { to: '/admin/users', label: t('admin.users'), icon: <FiUsers size={16} /> },
    { to: '/admin/listings', label: t('admin.listings'), icon: <FiCheckCircle size={16} />, active: true }
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
            <h2 style={{ fontWeight: 700, marginBottom: 'var(--space-6)' }}>{t('admin.listings')} - Pending Approval</h2>
            
            {pending.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
                <FiCheckCircle size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
                <p>No pending listings. All listings have been reviewed!</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Room Title & Info</th><th>Price</th><th>Owner</th><th>Actions</th></tr></thead>
                  <tbody>
                    {pending.map(l => (
                      <tr key={l._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{l.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.address || 'Address not specified'}</div>
                        </td>
                        <td>Rs. {l.price?.toLocaleString()}</td>
                        <td>{l.owner?.name || l.ownerId}</td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedListing(l)}>
                            <FiEye size={14} /> Review Listing
                          </button>
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

      {/* Review Listing Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="modal-overlay" onClick={() => setSelectedListing(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 'var(--space-4)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="card" style={{ maxWidth: 750, width: '100%', maxHeight: '85vh', overflowY: 'auto', background: 'var(--bg-primary)', padding: 'var(--space-6)' }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '2px' }}>Review Listing</h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{selectedListing.title}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => setSelectedListing(null)} style={{ alignSelf: 'flex-start' }}><FiX size={20} /></button>
              </div>
              
              <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: 4, height: 14, background: 'var(--primary)', borderRadius: 2 }}></span> Room Details
                    </h3>
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Owner Name:</span>
                        <span style={{ fontWeight: 600 }}>{selectedListing.owner?.name || selectedListing.ownerId}</span>
                        
                        <span style={{ color: 'var(--text-muted)' }}>Price:</span>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Rs. {selectedListing.price?.toLocaleString()}/mo</span>
                        
                        <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                        <span>{selectedListing.address || 'Not specified'}</span>
                        
                        <span style={{ color: 'var(--text-muted)' }}>Facilities:</span>
                        <div className="flex gap-1 flex-wrap">
                          {selectedListing.facilities?.length > 0 ? selectedListing.facilities.map(f => (
                            <span key={f} className="badge badge-outline" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{t(`facilities.${f}`) || f}</span>
                          )) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: 4, height: 14, background: 'var(--primary)', borderRadius: 2 }}></span> Description
                    </h3>
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                      {selectedListing.description}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 14, background: 'var(--primary)', borderRadius: 2 }}></span> Photos ({(selectedListing.photos || selectedListing.images)?.length || 0})
                  </h3>
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', height: '280px', overflowY: 'auto' }}>
                    {(selectedListing.photos || selectedListing.images)?.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {(selectedListing.photos || selectedListing.images).map((img, i) => (
                          <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '4/3' }}>
                            <img src={getImageUrl(img)} alt={`Room ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }} onClick={() => window.open(getImageUrl(img), '_blank')} title="Click to view full image" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <p>No images provided</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3" style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
                <button className="btn btn-danger" onClick={() => handleReject(selectedListing._id || selectedListing.id)} style={{ minWidth: 100 }}>
                  <FiX size={16} /> Reject
                </button>
                <button className="btn btn-success" onClick={() => handleApprove(selectedListing._id || selectedListing.id)} style={{ minWidth: 140 }}>
                  <FiCheck size={16} /> Approve & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
