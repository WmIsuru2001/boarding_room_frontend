import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiHeart, FiPhone, FiShield, FiEye, FiChevronLeft, FiChevronRight, FiTrash2, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { listingService } from '../services/listingService';
import { reviews as mockReviews } from '../mockData/mockDb';
import { getImageUrl } from '../utils/imageHelper';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showPhone, setShowPhone] = useState(false);
  const { user, profile, updateProfile, isStudent } = useAuth();
  
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([
      listingService.getListingById(id),
      listingService.getReviews(id)
    ]).then(([listingData, reviewsData]) => {
      setListing(listingData);
      setReviews(reviewsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner spinner-lg" /></div>;
  if (!listing) return <div className="empty-state" style={{ marginTop: '4rem' }}><div className="empty-icon">😔</div><h3>Listing not found</h3></div>;

  const rawImgs = listing.images || listing.photos || [];
  const imgs = rawImgs.length > 0 ? rawImgs.map(img => getImageUrl(img)) : [getImageUrl(null)];
  
  const listingId = listing.id || listing._id;
  const isFavorited = profile?.favorites?.some(f => (f._id || f) === listingId);

  const handleFavorite = async () => {
    if (!isStudent) return toast.error('Only students can save rooms!');
    try {
      const res = await listingService.toggleFavorite(listingId);
      updateProfile({ favorites: res.favorites });
      toast.success(res.isFavorite ? 'Added to saved rooms' : 'Removed from saved rooms');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const submitReview = async () => {
    if (!newComment.trim()) return toast.error('Please write a comment');
    setSubmittingReview(true);
    try {
      const review = await listingService.createReview(id, { rating: newRating, comment: newComment });
      setReviews([review, ...reviews]);
      setNewComment('');
      setNewRating(5);
      toast.success('Review added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await listingService.deleteReview(reviewId);
      setReviews(reviews.filter(r => (r._id || r.id) !== reviewId));
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="detail-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Image Gallery */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-8)', height: 400 }}>
          <img src={imgs[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {imgs.length > 1 && (
            <>
              <button onClick={() => setActiveImg(p => p > 0 ? p - 1 : imgs.length - 1)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiChevronLeft size={20} /></button>
              <button onClick={() => setActiveImg(p => p < imgs.length - 1 ? p + 1 : 0)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiChevronRight size={20} /></button>
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                {imgs.map((_, i) => <div key={i} onClick={() => setActiveImg(i)} style={{ width: 10, height: 10, borderRadius: '50%', background: i === activeImg ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />)}
              </div>
            </>
          )}
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleFavorite}>
              <FiHeart size={14} style={{ fill: isFavorited ? 'var(--danger)' : 'transparent', color: isFavorited ? 'var(--danger)' : 'currentColor' }} /> 
              {isFavorited ? t('listing.removeFromFav') : t('listing.addToFav')}
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {imgs.length > 1 && (
          <div className="flex gap-2" style={{ marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
            {imgs.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', cursor: 'pointer', border: i === activeImg ? '2px solid var(--primary)' : '2px solid transparent', opacity: i === activeImg ? 1 : 0.6 }} />
            ))}
          </div>
        )}

        <div className="detail-content">
          {/* Main Content */}
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-3)' }}>
              <span className={`badge ${listing.status === 'available' ? 'badge-success' : 'badge-danger'}`}>{t(`listing.${listing.status}`)}</span>
              {listing.roomType && <span className="badge badge-outline">{t(`listing.${listing.roomType}`)}</span>}
            </div>

            {listing.status === 'occupied' && listing.occupiedFrom && listing.occupiedUntil && (
              <div style={{ marginBottom: 'var(--space-4)', padding: '12px 16px', background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--danger)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>
                  <FiCalendar size={16} />
                  <span>Room Unavailable</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  This room is occupied from <strong>{new Date(listing.occupiedFrom).toLocaleDateString()}</strong> until <strong>{new Date(listing.occupiedUntil).toLocaleDateString()}</strong>.
                </p>
              </div>
            )}
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>{listing.title}</h1>
            <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-6)', color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><FiMapPin size={14} /> {listing.location?.address}</span>
              <span className="flex items-center gap-1"><FiEye size={14} /> {listing.viewCount} views</span>
              {listing.averageRating > 0 && (
                <span className="flex items-center gap-1"><FiStar size={14} style={{ color: 'var(--accent)' }} /> {listing.averageRating} ({listing.reviewCount} reviews)</span>
              )}
            </div>

            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>{t('listing.description')}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-8)' }}>{listing.description}</p>

            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>{t('listing.facilities')}</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
              {listing.facilities?.map(f => <span key={f} className="tag tag-primary">{t(`facilities.${f}`)}</span>)}
            </div>

            {listing.tenantPreferences && (
              <>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>{t('listing.tenantPref')}</h3>
                <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
                  <span className="tag">
                    {listing.tenantPreferences.gender === 'male' || listing.tenantPreferences.gender === 'boys only' ? t('listing.boysOnly') : 
                     listing.tenantPreferences.gender === 'female' || listing.tenantPreferences.gender === 'girls only' ? t('listing.girlsOnly') : 
                     t('listing.anyone')}
                  </span>
                  {listing.tenantPreferences.type && listing.tenantPreferences.type !== 'any' && <span className="tag">{listing.tenantPreferences.type}</span>}
                </div>
              </>
            )}

            {/* Location Map */}
            {listing.location?.coordinates && (
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>{t('owner.locationMap')}</h3>
                <div className="map-container" style={{ height: 300, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                      <Map
                        defaultCenter={{ lat: listing.location.coordinates[1], lng: listing.location.coordinates[0] }}
                        defaultZoom={15}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                      >
                        <Marker position={{ lat: listing.location.coordinates[1], lng: listing.location.coordinates[0] }} />
                      </Map>
                    </APIProvider>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <p style={{ color: 'var(--text-muted)' }}>📍 Map view not available (API Key Required)</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={{ marginTop: 'var(--space-8)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>{t('listing.reviews')} ({reviews.length})</h3>
              
              {isStudent && (
                <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', background: 'var(--bg-tertiary)', border: 'none' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)', fontSize: '1rem' }}>{t('listing.writeReview')}</h4>
                  <div className="flex items-center gap-1" style={{ marginBottom: 'var(--space-3)' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar 
                        key={s} 
                        size={20} 
                        style={{ cursor: 'pointer', fill: s <= newRating ? 'var(--accent)' : 'transparent', color: s <= newRating ? 'var(--accent)' : 'var(--border)' }} 
                        onClick={() => setNewRating(s)} 
                      />
                    ))}
                  </div>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Share your experience with this room..." 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                    style={{ marginBottom: 'var(--space-3)', minHeight: '80px' }} 
                  />
                  <button className="btn btn-primary" onClick={submitReview} disabled={submittingReview}>
                    {submittingReview ? (
                      <><div className="spinner spinner-sm" style={{ borderTopColor: 'white', marginRight: '8px' }} /> Submitting...</>
                    ) : (
                      'Post Review'
                    )}
                  </button>
                </div>
              )}

              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
              ) : (
                <div className="flex-col gap-4">
                  {reviews.map(r => (
                    <div key={r._id || r.id} className="card" style={{ padding: 'var(--space-4)' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-sm flex items-center justify-center">{r.student?.name?.charAt(0) || 'S'}</div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.student?.name || 'Student'}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="rating flex items-center gap-2">
                          <div>
                            {[1,2,3,4,5].map(s => <FiStar key={s} size={14} className={`star ${s <= r.rating ? '' : 'empty'}`} style={s <= r.rating ? { fill: 'var(--accent)', color: 'var(--accent)' } : { color: 'var(--border)' }} />)}
                          </div>
                          {(user?._id === r.student?._id || user?.id === r.student?._id) && (
                            <button onClick={() => handleDeleteReview(r._id || r.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete Review">
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>Rs. {listing.price?.toLocaleString()}</span>
              <span style={{ color: 'var(--text-muted)' }}>{t('listing.perMonth')}</span>
              {listing.deposit > 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>{t('listing.deposit')}: Rs. {listing.deposit?.toLocaleString()}</p>}
            </div>
            {listing.distance && (
              <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-4)', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <FiMapPin size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600 }}>{listing.distance} km</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('listing.fromCampus')}</span>
              </div>
            )}
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-3)', fontSize: '0.9rem' }}>{t('listing.ownerInfo')}</h4>
              <div className="flex items-center gap-3">
                <div className="avatar flex items-center justify-center">{listing.owner?.name?.[0] || 'K'}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{listing.owner?.name || 'Kamal Silva'}</p>
                  <div className="flex items-center gap-1"><FiShield size={12} style={{ color: 'var(--success)' }} /><span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>{t('listing.verified')}</span></div>
                </div>
              </div>
            </div>
            {showPhone ? (
              <a href={`tel:${listing.contactNumber || listing.owner?.phone}`} className="btn btn-primary w-full flex justify-center items-center gap-2" style={{ marginBottom: 'var(--space-3)' }}>
                <FiPhone size={16} /> {listing.contactNumber || listing.owner?.phone || 'No number available'}
              </a>
            ) : (
              <button onClick={() => setShowPhone(true)} className="btn btn-primary w-full" style={{ marginBottom: 'var(--space-3)' }}>
                <FiPhone size={16} /> {t('listing.contactOwner')}
              </button>
            )}
            <button className="btn btn-outline w-full" onClick={handleFavorite}>
              <FiHeart size={16} style={{ fill: isFavorited ? 'var(--danger)' : 'transparent', color: isFavorited ? 'var(--danger)' : 'currentColor' }} /> 
              {isFavorited ? t('listing.removeFromFav') : t('listing.addToFav')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
