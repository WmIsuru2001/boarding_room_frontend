import { useState } from 'react';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function SearchFilter({ onFilter, initialSearch = '' }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState('');
  const [roomType, setRoomType] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const allFacilities = ['kitchen', 'bathroom', 'parking', 'furnished', 'water', 'electricity', 'security'];

  const toggleFacility = (f) => {
    setSelectedFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleApply = () => {
    onFilter({ search, maxPrice: maxPrice ? Number(maxPrice) : null, roomType: roomType || null, maxDistance: maxDistance ? Number(maxDistance) : null, facilities: selectedFacilities.length ? selectedFacilities : null });
  };

  const handleClear = () => {
    setSearch(''); setMaxPrice(''); setRoomType(''); setMaxDistance(''); setSelectedFacilities([]);
    onFilter({});
  };

  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <div className="filter-bar">
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <FiSearch style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder={t('filter.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleApply()} />
        </div>
        <select className="form-select" value={roomType} onChange={e => setRoomType(e.target.value)} style={{ minWidth: 140 }}>
          <option value="">{t('filter.allTypes')}</option>
          <option value="single">{t('listing.single')}</option>
          <option value="shared">{t('listing.shared')}</option>
          <option value="full house">Full House</option>
        </select>
        <input className="form-input" type="number" placeholder={t('filter.priceRange')} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ maxWidth: 160 }} />
        <select className="form-select" value={maxDistance} onChange={e => setMaxDistance(e.target.value)} style={{ minWidth: 140 }}>
          <option value="">{t('filter.maxDistance')}</option>
          <option value="1">{'< 1 km'}</option>
          <option value="2">{'< 2 km'}</option>
          <option value="5">{'< 5 km'}</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowAdvanced(!showAdvanced)}>
          <FiSliders size={14} /> {t('listing.facilities')}
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleApply}>{t('filter.applyFilters')}</button>
        <button className="btn btn-ghost btn-sm" onClick={handleClear}><FiX size={14} /> {t('filter.clearAll')}</button>
      </div>
      {showAdvanced && (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
          <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>{t('listing.facilities')}</p>
          <div className="checkbox-group">
            {allFacilities.map(f => (
              <div key={f} className={`checkbox-item ${selectedFacilities.includes(f) ? 'checked' : ''}`} onClick={() => toggleFacility(f)}>
                {t(`facilities.${f}`)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
