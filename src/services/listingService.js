import api from './api';

export const listingService = {
  getPlatformStats: async () => {
    const res = await api.get('/listings/stats/platform');
    return res.stats;
  },
  getAllListings: async () => {
    const res = await api.get('/listings');
    return res.listings;
  },
  getListingById: async (id) => {
    const res = await api.get(`/listings/${id}`);
    return res.listing;
  },
  filterListings: async (criteria) => {
    const params = new URLSearchParams();
    if (criteria.maxPrice) params.append('maxPrice', criteria.maxPrice);
    if (criteria.maxDistance) params.append('maxDistance', criteria.maxDistance);
    if (criteria.roomType) params.append('roomType', criteria.roomType);
    if (criteria.gender) params.append('gender', criteria.gender);
    if (criteria.search) params.append('search', criteria.search);
    if (criteria.ownerId) params.append('ownerId', criteria.ownerId);
    if (criteria.facilities?.length) params.append('facilities', criteria.facilities.join(','));
    
    const res = await api.get(`/listings?${params.toString()}`);
    return res.listings;
  },
  toggleFavorite: async (listingId) => {
    const res = await api.post(`/users/favorites/${listingId}`);
    return res.data || res;
  },
  getFavorites: async () => {
    const res = await api.get('/users/favorites');
    return res.favorites || [];
  },
  getListingsByOwnerId: async (ownerId) => {
    const res = await api.get(`/listings?ownerId=${ownerId}`);
    return res.listings;
  },
  getMyListings: async () => {
    const res = await api.get('/listings/owner/my');
    return res.listings;
  },
  createListing: async (formData) => {
    const res = await api.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.listing;
  },
  updateListing: async (id, formData) => {
    const res = await api.put(`/listings/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updateListingStatus: async (listingId, status) => {
    const res = await api.patch(`/listings/${listingId}/status`, { status });
    return res.data;
  },
  deleteListing: async (id) => {
    const res = await api.delete(`/listings/${id}`);
    return res.data;
  },
  getReviews: async (listingId) => {
    const res = await api.get(`/reviews/${listingId}`);
    return res.reviews || [];
  },
  createReview: async (listingId, data) => {
    const res = await api.post(`/reviews/${listingId}`, data);
    return res.review;
  },
  deleteReview: async (reviewId) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data;
  }
};
