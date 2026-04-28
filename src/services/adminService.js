import api from './api';

export const adminService = {
  getPendingVerifications: async () => {
    const res = await api.get('/admin/verifications');
    return res.users;
  },
  reviewVerification: async (userId, action, adminNote) => {
    const res = await api.put(`/admin/verify/${userId}`, { action, adminNote });
    return res.user;
  },
  getPendingListings: async () => {
    const res = await api.get('/admin/listings/pending');
    return res.listings;
  },
  reviewListing: async (id, action, adminNote) => {
    const res = await api.put(`/admin/listings/${id}/review`, { action, adminNote });
    return res.listing;
  },
  getPlatformStats: async () => {
    const res = await api.get('/admin/stats');
    return res;
  },
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.users;
  },
  banUser: async (id, ban, reason) => {
    const res = await api.put(`/admin/users/${id}/ban`, { ban, reason });
    return res.user;
  },
  getReports: async () => {
    const res = await api.get('/admin/reports');
    return res.reports;
  },
  resolveReport: async (id, status) => {
    const res = await api.put(`/admin/reports/${id}`, { status });
    return res.report;
  }
};
