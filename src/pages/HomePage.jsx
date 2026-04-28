import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiHome, FiStar, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ListingCard from '../components/listings/ListingCard';
import { listingService } from '../services/listingService';

export default function HomePage() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [platformStats, setPlatformStats] = useState({ activeStudents: 0, verifiedListings: 0, totalReviews: 0, verifiedOwners: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listingService.getAllListings().catch(() => []),
      listingService.getPlatformStats().catch(() => ({ activeStudents: 250, verifiedListings: 3, totalReviews: 180, verifiedOwners: 15 }))
    ]).then(([listingsData, statsData]) => {
      setListings(listingsData || []);
      if (statsData) setPlatformStats(statsData);
      setLoading(false);
    });
  }, []);

  const topRated = [...listings].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 3);
  const recent = [...listings].sort((a, b) => b.id?.localeCompare(a.id)).slice(0, 3);

  const stats = [
    { icon: <FiUsers size={24} />, value: `${platformStats.activeStudents}+`, label: t('home.statsStudents'), color: '#4F46E5', bg: '#EEF2FF' },
    { icon: <FiHome size={24} />, value: `${platformStats.verifiedListings}+`, label: t('home.statsListings'), color: '#0EA5E9', bg: '#F0F9FF' },
    { icon: <FiStar size={24} />, value: `${platformStats.totalReviews}+`, label: t('home.statsReviews'), color: '#F59E0B', bg: '#FFFBEB' },
    { icon: <FiShield size={24} />, value: `${platformStats.verifiedOwners}+`, label: t('home.statsOwners'), color: '#10B981', bg: '#ECFDF5' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1>{t('home.heroTitle')} <span className="gradient-text">{t('home.heroHighlight')}</span><br /><span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('home.heroSubtitle')}</span></h1>
            <p>{t('home.heroDesc')}</p>
            <div className="flex items-center gap-4">
              <Link to="/search" className="btn btn-primary btn-lg"><FiHome size={18} /> {t('home.browseCTA')}</Link>
              <Link to="/map" className="btn btn-secondary btn-lg">{t('home.mapCTA')} <FiArrowRight size={16} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((s, i) => (
              <motion.div key={i} className="stats-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="stats-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div><div className="stats-value" style={{ color: s.color }}>{s.value}</div><div className="stats-label">{s.label}</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">⭐ {t('home.topRated')}</h2><p className="section-subtitle">{t('home.heroSubtitle')}</p></div>
            <Link to="/search" className="btn btn-ghost">{t('home.viewAll')} <FiArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="loading-screen"><div className="spinner spinner-lg" /></div>
          ) : (
            <div className="listing-grid">{topRated.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}</div>
          )}
        </div>
      </section>

      {/* Recently Added */}
      <section className="section" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <div className="section-header">
            <div><h2 className="section-title">🆕 {t('home.recentlyAdded')}</h2></div>
            <Link to="/search" className="btn btn-ghost">{t('home.viewAll')} <FiArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="loading-screen"><div className="spinner spinner-lg" /></div>
          ) : (
            <div className="listing-grid">{recent.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}</div>
          )}
        </div>
      </section>
    </>
  );
}
