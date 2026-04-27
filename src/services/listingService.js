import { listings } from '../mockData/mockDb';

let mockListings = [...listings];

export const listingService = {
  getAllListings: () => new Promise(resolve => {
    setTimeout(() => resolve(mockListings.filter(l => l.isApproved)), 500);
  }),
  getListingById: (id) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const listing = mockListings.find(l => l.id === id);
      listing ? resolve(listing) : reject(new Error("Not found"));
    }, 500);
  }),
  filterListings: (criteria) => new Promise(resolve => {
    setTimeout(() => {
      let results = mockListings.filter(l => l.isApproved);
      if (criteria.maxPrice) results = results.filter(l => l.price <= criteria.maxPrice);
      if (criteria.maxDistance) results = results.filter(l => l.distance <= criteria.maxDistance);
      if (criteria.facilities?.length) results = results.filter(l => criteria.facilities.every(f => l.facilities.includes(f)));
      if (criteria.roomType) results = results.filter(l => l.roomType === criteria.roomType);
      if (criteria.search) {
        const q = criteria.search.toLowerCase();
        results = results.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.location.address.toLowerCase().includes(q));
      }
      if (criteria.ownerId) results = mockListings.filter(l => l.ownerId === criteria.ownerId);
      resolve(results);
    }, 500);
  }),
  toggleFavorite: (userId, listingId) => new Promise(resolve => {
    setTimeout(() => resolve({ success: true, listingId }), 500);
  }),
  getListingsByOwnerId: (ownerId) => new Promise(resolve => {
    setTimeout(() => resolve(mockListings.filter(l => l.ownerId === ownerId)), 500);
  }),
  updateListingStatus: (listingId, newStatus) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockListings.findIndex(l => l.id === listingId);
      if (idx !== -1) { mockListings[idx] = { ...mockListings[idx], status: newStatus }; resolve(mockListings[idx]); }
      else reject(new Error("Not found"));
    }, 500);
  })
};
