/**
 * Image URL Handler - Supports Multiple Formats
 * Supported image formats: JPEG, JPG, PNG, WebP, GIF, SVG, BMP, TIFF, ICO
 * Supported document formats: PDF, TXT, DOCX
 * 
 * @param {string} url - Image or document URL
 * @param {string} type - 'image' (default) or 'document'
 * @returns {string} - Complete, accessible URL
 */
export const getImageUrl = (url, type = 'image') => {
  // If no URL provided, return appropriate placeholder
  if (!url) {
    return type === 'document' 
      ? 'https://via.placeholder.com/400x300?text=No+Document' 
      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';
  }

  // If URL is already complete (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Handle local uploads (relative paths)
  if (url.startsWith('/uploads/')) {
    return `http://localhost:5000${url}`;
  }

  // If just a path, assume it's a local upload
  if (url.startsWith('/')) {
    return `http://localhost:5000${url}`;
  }

  return url;
};

/**
 * Verification Document Image Handler
 * Safely loads verification images with Cloudinary URL support
 * 
 * @param {string} imageUrl - Cloudinary or local image URL
 * @param {string} fallbackType - 'nic' or 'bill' for appropriate placeholder
 * @returns {string} - Safe, accessible image URL
 */
export const getVerificationImageUrl = (imageUrl, fallbackType = 'document') => {
  if (!imageUrl) {
    // Appropriate placeholder based on document type
    if (fallbackType === 'nic') {
      return 'https://via.placeholder.com/400x300?text=ID+Card';
    } else if (fallbackType === 'bill') {
      return 'https://via.placeholder.com/400x300?text=Utility+Bill';
    }
    return 'https://via.placeholder.com/400x300?text=Document';
  }

  // Cloudinary URLs are already complete HTTPS
  if (imageUrl.includes('cloudinary') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Local URLs - add localhost prefix
  if (imageUrl.startsWith('/')) {
    return `http://localhost:5000${imageUrl}`;
  }

  return imageUrl;
};
