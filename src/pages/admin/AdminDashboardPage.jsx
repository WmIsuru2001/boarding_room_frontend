import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiHome, FiShield, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StatsCard from '../../components/admin/StatsCard';
import { adminService } from '../../services/adminService';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminService.getPlatformStats().then(data => { setStats(data); setLoading(false); }); }, []);

  const sidebarItems = [
    { to: '/admin', label: t('admin.overview'), icon: <FiHome size={16} />, active: true },
    { to: '/admin/verifications', label: t('admin.verifications'), icon: <FiShield size={16} /> },
    { to: '/admin/users', label: t('admin.users'), icon: <FiUsers size={16} /> },
    { to: '/admin/listings', label: t('admin.listings'), icon: <FiCheckCircle size={16} /> },
    { to: '/admin/reports', label: t('admin.reports'), icon: <FiAlertTriangle size={16} /> },
    { to: '/admin/universities', label: t('admin.universities'), icon: <FiHome size={16} /> },
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
            <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
              <StatsCard icon={<FiUsers size={22} />} label={t('admin.totalUsers')} value={stats?.totalUsers || 0} />
              <StatsCard icon={<FiHome size={22} />} label={t('admin.activeListings')} value={stats?.activeListings || 0} color="#10B981" bgColor="#ECFDF5" />
              <StatsCard icon={<FiClock size={22} />} label={t('admin.pendingListings')} value={stats?.pendingApprovals || 0} color="#F59E0B" bgColor="#FFFBEB" />
              <StatsCard icon={<FiShield size={22} />} label={t('admin.pendingVerifications')} value={stats?.pendingVerifications || 0} color="#0EA5E9" bgColor="#F0F9FF" />
            </div>
            <div className="grid-2">
              <div className="card" style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
                <div className="flex-col gap-3">
                  <Link to="/admin/verifications" className="btn btn-secondary w-full"><FiShield size={14} /> Review Verifications ({stats?.pendingVerifications || 0})</Link>
                  <Link to="/admin/listings" className="btn btn-secondary w-full"><FiCheckCircle size={14} /> Approve Listings ({stats?.pendingApprovals || 0})</Link>
                  <Link to="/admin/reports" className="btn btn-secondary w-full"><FiAlertTriangle size={14} /> View Reports ({stats?.pendingReports || 0})</Link>
                </div>
              </div>
              <div className="card" style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Platform Overview</h3>
                <div className="flex-col gap-3">
                  <div className="flex items-center justify-between"><span style={{ color: 'var(--text-muted)' }}>{t('admin.students')}</span><span style={{ fontWeight: 700 }}>{stats?.totalStudents || 0}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: 'var(--text-muted)' }}>{t('admin.owners')}</span><span style={{ fontWeight: 700 }}>{stats?.totalOwners || 0}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: 'var(--text-muted)' }}>Total Listings</span><span style={{ fontWeight: 700 }}>{stats?.totalListings || 0}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
