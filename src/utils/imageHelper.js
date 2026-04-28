export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'; // Default placeholder
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `http://localhost:5000${url}`;
  return url;
};
