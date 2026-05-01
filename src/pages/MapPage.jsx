import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin } from 'react-icons/fi';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { listingService } from '../services/listingService';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';
import { useAuth } from '../context/AuthContext';
import SignInPromptModal from '../components/listings/SignInPromptModal';

export default function MapPage() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Trincomalee Campus Location
  const center = { lat: 8.652779, lng: 81.211337 };

  useEffect(() => {
    listingService.getAllListingsForMap().then(data => setListings(data));
  }, []);

  const handleViewDetails = (listing) => {
    if (!isAuthenticated) {
      setShowSignInPrompt(true);
      return;
    }
    navigate(`/listings/${listing.id || listing._id}`);
  };

  // Marker icon URLs by room status
  const MARKER_ICONS = {
    available: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    occupied:  'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    pending:   'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="page-container">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}><FiMapPin style={{ display: 'inline' }} /> {t('nav.map')}</h1>
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>Google Maps API Key Missing</h3>
          <p>Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
        <FiMapPin style={{ display: 'inline' }} /> {t('nav.map')}
      </h1>

      <div className="map-container" style={{ height: '70vh', minHeight: '500px' }}>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={center}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            {/* Campus Marker */}
            <Marker
              position={center}
              title="Eastern University Trincomalee Campus"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />

            {/* Listing Markers */}
            {listings.filter(l => l.status === 'available' || l.status === 'occupied').map(listing => {
              if (!listing.location || !listing.location.coordinates) return null;
              // Coordinates are [lng, lat]
              const position = {
                lat: listing.location.coordinates[1],
                lng: listing.location.coordinates[0]
              };

              const iconUrl = MARKER_ICONS[listing.status] || MARKER_ICONS.available;

              return (
                <Marker
                  key={listing.id || listing._id}
                  position={position}
                  onClick={() => setSelectedListing(listing)}
                  title={`${listing.title} (${listing.status})`}
                  icon={{ url: iconUrl }}
                />
              );
            })}

            {/* Info Window for Selected Listing */}
            {selectedListing && (
              <InfoWindow
                position={{
                  lat: selectedListing.location.coordinates[1],
                  lng: selectedListing.location.coordinates[0]
                }}
                onCloseClick={() => setSelectedListing(null)}
              >
                <div style={{ padding: '8px', maxWidth: '200px' }}>
                  <img
                    src={getImageUrl(selectedListing.images?.[0] || selectedListing.photos?.[0])}
                    alt={selectedListing.title}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                  />
                  <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{selectedListing.title}</h4>
                  <p style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                    Rs. {selectedListing.price?.toLocaleString()}
                  </p>
                  <button
                    id="map-view-details-btn"
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => handleViewDetails(selectedListing)}
                  >
                    {t('listing.viewDetails')}
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Map Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
        marginTop: 'var(--space-4)', padding: '12px 16px',
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', width: 'fit-content',
        fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)'
      }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: 4 }}>Legend:</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="available" style={{ width: 18, height: 18 }} />
          Available
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="occupied" style={{ width: 18, height: 18 }} />
          Occupied
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="campus" style={{ width: 18, height: 18 }} />
          Campus
        </span>
      </div>

      <SignInPromptModal
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
      />
    </div>
  );
}

