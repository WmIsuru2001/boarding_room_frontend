import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiHeart, FiHome, FiEdit, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { listingService } from '../../services/listingService';
import StatsCard from '../../components/admin/StatsCard';
import toast from 'react-hot-toast';

export default function OwnerDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingService.getListingsByOwnerId(user?.id || 'owner1').then(data => { setListings(data); setLoading(false); });
  }, [user]);

  const totalViews = listings.reduce((s, l) => s + (l.viewCount || 0), 0);
  const totalFavs = listings.reduce((s, l) => s + (l.favoriteCount || 0), 0);
  const activeCount = listings.filter(l => l.status === 'available' && l.isApproved).length;

  const toggleStatus = async (id) => {
    const listing = listings.find(l => l.id === id);
    const newStatus = listing.status === 'available' ? 'occupied' : 'available';
    await listingService.updateListingStatus(id, newStatus);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    toast.success(`Marked as ${newStatus}`);
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-8)' }}>
          <div><h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>🏠 {t('owner.dashboard')}</h1><p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.name}</p></div>
          <Link to="/owner/listings/new" className="btn btn-primary"><FiPlus size={16} /> {t('owner.addRoom')}</Link>
        </div>
        <div className="grid-3" style={{ marginBottom: 'var(--space-8)' }}>
          <StatsCard icon={<FiEye size={22} />} label={t('owner.totalViews')} value={totalViews} color="#0EA5E9" bgColor="#F0F9FF" />
          <StatsCard icon={<FiHeart size={22} />} label={t('owner.totalFavorites')} value={totalFavs} color="#EF4444" bgColor="#FEF2F2" />
          <StatsCard icon={<FiHome size={22} />} label={t('owner.activeListings')} value={activeCount} color="#10B981" bgColor="#ECFDF5" />
        </div>
        <h2 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>{t('owner.myRooms')} ({listings.length})</h2>
        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <div className="flex-col gap-4">
            {listings.map(l => (
              <div key={l.id} className="card" style={{ display: 'flex', overflow: 'hidden' }}>
                <img src={l.images?.[0]} alt={l.title} style={{ width: 180, height: 140, objectFit: 'cover' }} />
                <div style={{ flex: 1, padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <h3 style={{ fontWeight: 700 }}>{l.title}</h3>
                      <span className={`badge ${l.status === 'available' ? 'badge-success' : l.status === 'occupied' ? 'badge-danger' : 'badge-warning'}`}>{l.status}</span>
                      {!l.isApproved && <span className="badge badge-warning">Pending Approval</span>}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rs. {l.price?.toLocaleString()}/month • {l.distance} km from campus</p>
                    <div className="flex items-center gap-4" style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span><FiEye size={12} style={{ display: 'inline' }} /> {l.viewCount || 0} views</span>
                      <span><FiHeart size={12} style={{ display: 'inline' }} /> {l.favoriteCount || 0} favs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(l.id)}>
                      {l.status === 'available' ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                      {l.status === 'available' ? t('owner.markOccupied') : t('owner.markAvailable')}
                    </button>
                    <Link to={`/owner/listings/${l.id}/edit`} className="btn btn-ghost btn-sm"><FiEdit size={14} /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
