import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMapPin, FiStar, FiEye, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../utils/imageHelper';
import { useAuth } from '../../context/AuthContext';
import { listingService } from '../../services/listingService';
import toast from 'react-hot-toast';
import SignInPromptModal from './SignInPromptModal';

export default function ListingCard({ listing, index = 0 }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, updateProfile, isStudent, isAuthenticated } = useAuth();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const rawImg = listing.images?.[0] || listing.photos?.[0];
  const img = getImageUrl(rawImg);
  const statusColors = { available: 'badge-success', occupied: 'badge-danger', pending: 'badge-warning' };

  const listingId = listing.id || listing._id;
  const isFavorited = profile?.favorites?.some(f => (f._id || f) === listingId);

  const handleCardClick = () => {
    if (!isAuthenticated) {
      setShowSignInPrompt(true);
      return;
    }
    navigate(`/listings/${listingId}`);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!isStudent) return toast.error('Only students can save rooms!');
    try {
      const res = await listingService.toggleFavorite(listingId);
      updateProfile({ favorites: res.favorites });
      toast.success(res.isFavorite ? 'Added to saved rooms' : 'Removed from saved rooms');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <>
      <motion.div
        className="card listing-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        onClick={handleCardClick}
      >
        <div className="card-image">
          <img src={img} alt={listing.title} loading="lazy" />
          <div className="card-badges">
            <span className={`badge ${statusColors[listing.status] || 'badge-outline'}`}>
              {t(`listing.${listing.status}`)}
            </span>
            {listing.roomType && <span className="badge badge-outline">{t(`listing.${listing.roomType}`)}</span>}
          </div>
          <button className="card-fav" onClick={handleFavorite}>
            <FiHeart size={16} style={{ fill: isFavorited ? 'var(--danger)' : 'transparent', color: isFavorited ? 'var(--danger)' : 'var(--text-primary)' }} />
          </button>
        </div>
        <div className="card-body">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>{listing.title}</h3>
          <div className="flex items-center gap-2" style={{ marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <FiMapPin size={13} />
            <span className="truncate">{listing.location?.address || listing.address}</span>
          </div>
          {listing.contactNumber && (
            <div className="flex items-center gap-2" style={{ marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <FiPhone size={13} />
              <span>{listing.contactNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-4" style={{ marginBottom: '12px' }}>
            {listing.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <FiStar size={13} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{listing.averageRating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({listing.reviewCount})</span>
              </div>
            )}
            {listing.distance && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{listing.distance} km {t('listing.fromCampus')}</span>
            )}
          </div>
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', marginBottom: '12px' }}>
            {listing.facilities?.slice(0, 4).map(f => (
              <span key={f} className="tag">{t(`facilities.${f}`)}</span>
            ))}
            {listing.facilities?.length > 4 && <span className="tag">+{listing.facilities.length - 4}</span>}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>Rs. {listing.price?.toLocaleString()}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('listing.perMonth')}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <FiEye size={12} /> {listing.viewCount || 0}
            </div>
          </div>
        </div>
      </motion.div>

      <SignInPromptModal
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
      />
    </>
  );
}
