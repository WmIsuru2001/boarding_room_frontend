import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiImage, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { listingService } from '../../services/listingService';

export default function AddListingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [roomType, setRoomType] = useState('single');
  const [gender, setGender] = useState('any');
  const [facilities, setFacilities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Default to Eastern University Trincomalee Campus
  const [mapLocation, setMapLocation] = useState({ lat: 8.5874, lng: 81.2152 });

  const allFacilities = ['kitchen', 'bathroom', 'parking', 'furnished', 'water', 'electricity', 'security'];

  const toggleFacility = (f) => setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('deposit', deposit || 0);
      formData.append('address', address);
      formData.append('contactNumber', contactNumber);
      formData.append('roomType', roomType);
      formData.append('coordinates', JSON.stringify(mapLocation));
      formData.append('facilities', JSON.stringify(facilities));
      formData.append('tenantPreferences', JSON.stringify({ gender: gender }));

      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      await listingService.createListing(formData);
      toast.success('Listing submitted for admin approval!');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit listing');
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    setPhotos(prev => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleMapClick = (e) => {
    if (e.detail.latLng) {
      setMapLocation({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-8)' }}>➕ {t('owner.addRoom')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}>Basic Information</h3>
            <div className="form-group"><label className="form-label">{t('owner.roomTitle')}</label><input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Spacious Room near EUSL" /></div>
            <div className="form-group"><label className="form-label">{t('owner.roomDesc')}</label><textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe your room..." /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">{t('owner.roomPrice')}</label><input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="15000" /></div>
              <div className="form-group"><label className="form-label">{t('owner.roomDeposit')}</label><input className="form-input" type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="5000" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">{t('owner.roomType')}</label>
                <select className="form-select" value={roomType} onChange={e => setRoomType(e.target.value)}>
                  <option value="single">{t('listing.single')}</option><option value="shared">{t('listing.shared')}</option>
                  <option value="studio">{t('listing.studio')}</option><option value="apartment">{t('listing.apartment')}</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">{t('owner.gender')}</label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="any">{t('listing.anyone')}</option><option value="male">{t('listing.boysOnly')}</option><option value="female">{t('listing.girlsOnly')}</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">{t('owner.roomAddress')}</label><input className="form-input" value={address} onChange={e => setAddress(e.target.value)} required placeholder="15 Temple Road, Trincomalee" /></div>
            <div className="form-group"><label className="form-label">Contact Number</label><input className="form-input" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required placeholder="e.g. 0712345678" /></div>
          </div>

          <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}>{t('owner.roomFacilities')}</h3>
            <div className="checkbox-group">
              {allFacilities.map(f => (
                <div key={f} className={`checkbox-item ${facilities.includes(f) ? 'checked' : ''}`} onClick={() => toggleFacility(f)}>{t(`facilities.${f}`)}</div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}><FiImage style={{ display: 'inline' }} /> {t('owner.uploadPhotos')}</h3>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <input
                type="file"
                multiple
                accept="image/*"
                id="photo-upload"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <label
                htmlFor="photo-upload"
                style={{ display: 'block', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                  e.preventDefault(); e.stopPropagation();
                  if (e.dataTransfer.files) handlePhotoChange({ target: { files: e.dataTransfer.files } });
                }}
              >
                <FiImage size={32} style={{ marginBottom: 'var(--space-3)' }} />
                <p>Drag & drop photos here or click to browse</p>
                <p style={{ fontSize: '0.8rem' }}>Max 10 photos, 5MB each</p>
              </label>
            </div>

            {photoPreviews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} style={{ position: 'relative', paddingTop: '100%' }}>
                    <img src={preview} alt={`Preview ${idx}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}><FiMapPin style={{ display: 'inline' }} /> Location & Map</h3>

            <div className="grid-2" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  className="form-input"
                  type="number"
                  step="any"
                  value={mapLocation.lat}
                  onChange={e => setMapLocation(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  className="form-input"
                  type="number"
                  step="any"
                  value={mapLocation.lng}
                  onChange={e => setMapLocation(prev => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="map-container" style={{ height: 300, background: 'var(--bg-tertiary)' }}>
              {apiKey ? (
                <APIProvider apiKey={apiKey}>
                  <Map
                    defaultCenter={mapLocation}
                    defaultZoom={15}
                    onClick={handleMapClick}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                  >
                    <Marker position={mapLocation} />
                  </Map>
                </APIProvider>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p style={{ color: 'var(--text-muted)' }}>📍 Click on the map to set your room's location (API Key Required)</p>
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
              📍 Click anywhere on the map to automatically update the Latitude and Longitude above.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" className="btn btn-primary btn-lg"><FiSave size={16} /> {t('owner.saveListing')}</button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/owner/dashboard')}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
