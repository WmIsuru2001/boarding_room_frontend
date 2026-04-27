import { listings, users } from '../mockData/mockDb';

let mockListings = [...listings];

export const adminService = {
  getPendingVerifications: () => new Promise(resolve => {
    setTimeout(() => resolve(mockListings.filter(l => !l.isApproved)), 500);
  }),
  approveListing: (id) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockListings.findIndex(l => l.id === id);
      if (idx !== -1) { mockListings[idx] = { ...mockListings[idx], isApproved: true }; resolve(mockListings[idx]); }
      else reject(new Error("Not found"));
    }, 500);
  }),
  getPlatformStats: () => new Promise(resolve => {
    setTimeout(() => resolve({
      totalUsers: users.length, totalStudents: users.filter(u => u.role === 'student').length,
      totalOwners: users.filter(u => u.role === 'owner').length,
      totalListings: mockListings.length, activeListings: mockListings.filter(l => l.isApproved && l.status === 'available').length,
      pendingApprovals: mockListings.filter(l => !l.isApproved).length, pendingVerifications: 2, pendingReports: 1
    }), 500);
  })
};
