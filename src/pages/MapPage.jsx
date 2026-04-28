import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin } from 'react-icons/fi';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { listingService } from '../services/listingService';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

export default function MapPage() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  // Trincomalee Campus Location
  const center = { lat: 8.652779, lng: 81.211337 };

  useEffect(() => {
    listingService.getAllListings().then(data => setListings(data));
  }, []);

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
            {listings.map(listing => {
              if (!listing.location || !listing.location.coordinates) return null;
              // Coordinates are [lng, lat]
              const position = {
                lat: listing.location.coordinates[1],
                lng: listing.location.coordinates[0]
              };

              return (
                <Marker
                  key={listing.id || listing._id}
                  position={position}
                  onClick={() => setSelectedListing(listing)}
                  title={listing.title}
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
                    className="btn btn-primary btn-sm w-full"
                    onClick={() => navigate(`/listings/${selectedListing.id || selectedListing._id}`)}
                  >
                    {t('listing.viewDetails')}
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
