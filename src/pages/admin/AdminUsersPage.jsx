import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiSlash, FiHome, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <h2 style={{ fontWeight: 700, marginBottom: 'var(--space-6)' }}><FiUsers style={{ display: 'inline', marginRight: 8 }} /> All Users</h2>
            
            {users.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
                <p>No users found.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'owner' ? 'badge-warning' : 'badge-outline'}`}>{u.role}</span></td>
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
    </div>
  );
}
