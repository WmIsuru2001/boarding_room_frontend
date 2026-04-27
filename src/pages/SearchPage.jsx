import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ListingCard from '../components/listings/ListingCard';
import SearchFilter from '../components/listings/SearchFilter';
import { listingService } from '../services/listingService';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialSearch = searchParams.get('q') || '';

  useEffect(() => {
    if (initialSearch) handleFilter({ search: initialSearch });
    else listingService.getAllListings().then(data => { setListings(data); setLoading(false); });
  }, []);

  const handleFilter = (criteria) => {
    setLoading(true);
    listingService.filterListings(criteria).then(data => { setListings(data); setLoading(false); });
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>🔍 {t('nav.listings')}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>{listings.length} {t('listing.available').toLowerCase()} rooms</p>
      <SearchFilter onFilter={handleFilter} initialSearch={initialSearch} />
      {loading ? (
        <div className="loading-screen"><div className="spinner spinner-lg" /></div>
      ) : listings.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏠</div><h3>{t('listing.noResults')}</h3><p>{t('listing.tryDifferent')}</p></div>
      ) : (
        <div className="listing-grid">{listings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}</div>
      )}
    </div>
  );
}
