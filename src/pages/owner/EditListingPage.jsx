import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiImage, FiMapPin, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { listingService } from '../../services/listingService';
import FullPageLoader from '../../components/layout/FullPageLoader';

export default function EditListingPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
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
  const [submitting, setSubmitting] = useState(false);
  
  const [mapLocation, setMapLocation] = useState({ lat: 8.5874, lng: 81.2152 });

  const allFacilities = ['kitchen', 'bathroom', 'parking', 'furnished', 'water', 'electricity', 'security'];

  useEffect(() => {
    listingService.getListingById(id).then(data => {
      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setPrice(data.price || '');
        setDeposit(data.deposit || '');
        setAddress(data.location?.address || data.address || '');
        setContactNumber(data.contactNumber || '');
        setRoomType(data.roomType || 'single');
        setGender(data.tenantPreferences?.gender || 'any');
        setFacilities(data.facilities || []);
        
        // Load existing images
        const existingImages = data.images || data.photos || [];
        setPhotoPreviews(existingImages);
        // We leave photos array empty for now, as it represents NEW files to upload.
        // In a real app, we'd distinguish between existing URLs and new File objects.
        
        if (data.location?.coordinates) {
          setMapLocation({ 
            lat: data.location.coordinates[1], 
            lng: data.location.coordinates[0] 
          });
        }
      }
      setLoading(false);
    }).catch(err => {
      toast.error('Failed to load listing');
      setLoading(false);
    });
  }, [id]);

  const toggleFacility = (f) => setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSave = async (e) => { 
    e.preventDefault();
    setSubmitting(true);
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

      await listingService.updateListing(id, formData);
      toast.success('Listing updated successfully!'); 
      navigate('/owner/dashboard'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await listingService.deleteListing(id);
      toast.success('Listing deleted!');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photoPreviews.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    setPhotoPreviews(prev => {
      const newPreviews = [...prev];
      const removed = newPreviews.splice(index, 1)[0];
      // If it's a blob URL, revoke it to avoid memory leaks
      if (typeof removed === 'string' && removed.startsWith('blob:')) {
        URL.revokeObjectURL(removed);
        // Also remove from photos array based on matching logic 
        // (Simplified for this mock: we'll just remove the last uploaded file)
        setPhotos(p => p.slice(0, p.length - 1)); 
      }
      return newPreviews;
    });
  };

  const handleMapClick = (e) => {
    if (e.detail.latLng) {
      setMapLocation({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (loading) return <div className="loading-screen"><div className="spinner spinner-lg" /></div>;

  return (
    <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-4)' }}><FiArrowLeft size={16} /> Back</button>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>✏️ {t('owner.editRoom')}</h1>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={submitting}><FiTrash2 size={14} /> Delete Listing</button>
        </div>

        <form onSubmit={handleSave}>
          <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}>{t('owner.basicInfo')}</h3>
            <div className="form-group"><label className="form-label">{t('owner.roomTitle')}</label><input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">{t('owner.roomDesc')}</label><textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} required /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">{t('owner.roomPrice')}</label><input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} required /></div>
              <div className="form-group"><label className="form-label">{t('owner.roomDeposit')}</label><input className="form-input" type="number" value={deposit} onChange={e => setDeposit(e.target.value)} /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">{t('owner.roomType')}</label>
                <select className="form-select" value={roomType} onChange={e => setRoomType(e.target.value)}>
                  <option value="single">{t('listing.single')}</option><option value="shared">{t('listing.shared')}</option>
                  <option value="full house">{t('listing.full house')}</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">{t('owner.gender')}</label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="any">{t('listing.anyone')}</option><option value="male">{t('listing.boysOnly')}</option><option value="female">{t('listing.girlsOnly')}</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">{t('owner.roomAddress')}</label><input className="form-input" value={address} onChange={e => setAddress(e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">{t('owner.contactInfo')}</label><input className="form-input" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required placeholder="e.g. 0712345678" /></div>
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
                id="photo-upload-edit" 
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <label 
                htmlFor="photo-upload-edit"
                style={{ display: 'block', border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                  e.preventDefault(); e.stopPropagation();
                  if (e.dataTransfer.files) handlePhotoChange({ target: { files: e.dataTransfer.files } });
                }}
              >
                <FiImage size={32} style={{ marginBottom: 'var(--space-3)' }} />
                <p>Drag & drop new photos here or click to browse</p>
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
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-5)' }}><FiMapPin style={{ display: 'inline' }} /> {t('owner.locationMap')}</h3>
            
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
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? (
                <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Updating...</>
              ) : (
                <><FiSave size={16} /> {t('owner.saveListing')}</>
              )}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/owner/dashboard')} disabled={submitting}>Cancel</button>
          </div>
        </form>
      </motion.div>

      {/* Full-page loader during update */}
      <FullPageLoader 
        isVisible={submitting} 
        message="Updating room details..." 
        blur={true}
      />
    </div>
  );
}
