import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiSlash, FiHome, FiAlertTriangle, FiCheckCircle, FiEye, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    adminService.getUsers().then(data => {
      setUsers(data || []);
      setLoading(false);
    });
  }, []);

  const handleBanToggle = async (user) => {
    try {
      const newBanStatus = !user.isBanned;
      await adminService.banUser(user._id, newBanStatus, newBanStatus ? 'Violation of terms' : '');
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBanned: newBanStatus } : u));
      toast.success(newBanStatus ? 'User banned successfully' : 'User unbanned successfully');
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const sidebarItems = [
    { to: '/admin', label: t('admin.overview'), icon: <FiHome size={16} /> },
    { to: '/admin/verifications', label: t('admin.verifications'), icon: <FiShield size={16} /> },
    { to: '/admin/users', label: t('admin.users'), icon: <FiUsers size={16} />, active: true },
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontWeight: 700, margin: 0 }}><FiUsers style={{ display: 'inline', marginRight: 8 }} /> All Users</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn btn-sm ${filterRole === 'all' ? 'btn-primary' : ''}`}
                  style={filterRole !== 'all' ? { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' } : {}}
                  onClick={() => setFilterRole('all')}
                >All</button>
                <button
                  className={`btn btn-sm ${filterRole === 'student' ? 'btn-primary' : ''}`}
                  style={filterRole !== 'student' ? { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' } : {}}
                  onClick={() => setFilterRole('student')}
                >Students</button>
                <button
                  className={`btn btn-sm ${filterRole === 'owner' ? 'btn-primary' : ''}`}
                  style={filterRole !== 'owner' ? { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' } : {}}
                  onClick={() => setFilterRole('owner')}
                >Owners</button>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
                <p>No users found.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Profile</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.filter(u => filterRole === 'all' ? true : u.role === filterRole).map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'owner' ? 'badge-warning' : 'badge-outline'}`}>{u.role}</span></td>
                        <td>
                          <button className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }} onClick={() => setSelectedUser(u)}>
                            <FiEye size={12} style={{ display: 'inline', marginRight: 4 }} /> View
                          </button>
                        </td>
                        <td>
                          {u.isBanned ? (
                            <span className="badge badge-danger">Banned</span>
                          ) : u.role === 'owner' ? (
                            u.verificationStatus === 'verified' ? <span className="badge badge-verified"><FiShield size={10} /> Verified</span> : <span className="badge badge-outline">{u.verificationStatus || 'Unverified'}</span>
                          ) : (
                            <span className="badge badge-outline">Active</span>
                          )}
                        </td>
                        <td>
                          {u.role !== 'admin' && (
                            <button className={`btn btn-sm ${u.isBanned ? 'btn-success' : 'btn-danger'}`} onClick={() => handleBanToggle(u)}>
                              <FiSlash size={12} /> {u.isBanned ? 'Unban' : t('admin.ban')}
                            </button>
                          )}
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

      {/* User Profile Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedUser(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#f0f0f0', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{selectedUser.name}'s Profile</h3>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><FiX size={20} /></button>
            </div>

            {selectedUser.role === 'student' && (
              <div>
                <p><strong>Campus Registration No:</strong> {selectedUser.campusRegistrationNumber || 'N/A'}</p>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <strong>Student ID (Front):</strong>
                  {selectedUser.studentIdFrontImage ? <img src={selectedUser.studentIdFrontImage} alt="ID Front" style={{ width: '100%', marginTop: '8px', borderRadius: 'var(--radius-md)' }} /> : <p style={{ color: 'var(--text-muted)' }}>Not uploaded</p>}
                </div>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <strong>Student ID (Back):</strong>
                  {selectedUser.studentIdBackImage ? <img src={selectedUser.studentIdBackImage} alt="ID Back" style={{ width: '100%', marginTop: '8px', borderRadius: 'var(--radius-md)' }} /> : <p style={{ color: 'var(--text-muted)' }}>Not uploaded</p>}
                </div>
              </div>
            )}

            {selectedUser.role === 'owner' && (
              <div>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <strong>National ID (NIC):</strong>
                  {selectedUser.nicImage ? <img src={selectedUser.nicImage} alt="NIC" style={{ width: '100%', marginTop: '8px', borderRadius: 'var(--radius-md)' }} /> : <p style={{ color: 'var(--text-muted)' }}>Not uploaded</p>}
                </div>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <strong>Utility Bill:</strong>
                  {selectedUser.utilityBillImage ? <img src={selectedUser.utilityBillImage} alt="Utility Bill" style={{ width: '100%', marginTop: '8px', borderRadius: 'var(--radius-md)' }} /> : <p style={{ color: 'var(--text-muted)' }}>Not uploaded</p>}
                </div>
              </div>
            )}

            {selectedUser.role === 'admin' && (
              <div><p>Admin user.</p></div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
