import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { listingService } from '../../services/listingService';
import ListingCard from '../../components/listings/ListingCard';
import { useAuth } from '../../context/AuthContext';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingService.getFavorites()
      .then(data => { setFavorites(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [profile?.favorites]); // refetch when favorites change so removed ones disappear

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}><FiHeart style={{ display: 'inline', color: 'var(--danger)', fill: 'var(--danger)' }} /> {t('nav.saved')}</h1>
        
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">💝</div><h3>No saved rooms yet</h3><p>Start browsing and save rooms you like to compare them later!</p></div>
        ) : (
          <div className="grid-3" style={{ marginTop: 'var(--space-4)' }}>
            {favorites.map((listing, i) => (
              <ListingCard key={listing._id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
