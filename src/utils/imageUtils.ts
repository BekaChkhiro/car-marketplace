/**
 * Utility functions for optimizing image delivery
 */

/**
 * Generate responsive image srcset for AWS S3 images
 * @param imageUrl - Original image URL
 * @param sizes - Array of width sizes for responsive images
 * @returns srcset string for responsive images
 */
export const generateSrcSet = (imageUrl: string, sizes: number[] = [290, 580, 870, 1160]): string => {
  // Only generate srcset for S3 images
  if (!imageUrl || !imageUrl.includes('amazonaws.com')) {
    return '';
  }

  // For now, return empty string as we need server-side image optimization
  // This can be enhanced when image resizing is implemented on the backend
  return '';
};

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints - Object with breakpoints and sizes
 * @returns sizes string for responsive images
 */
export const generateSizes = (breakpoints?: { [key: string]: string }): string => {
  const defaultBreakpoints = {
    '(max-width: 640px)': '50vw',
    '(max-width: 1024px)': '33vw',
    '(max-width: 1280px)': '25vw',
    default: '290px'
  };

  const sizesToUse = breakpoints || defaultBreakpoints;

  const sizeEntries = Object.entries(sizesToUse)
    .filter(([key]) => key !== 'default')
    .map(([breakpoint, size]) => `${breakpoint} ${size}`)
    .join(', ');

  return `${sizeEntries}, ${sizesToUse.default || '290px'}`;
};

/**
 * Get optimized image URL with compression parameters
 * Note: This requires backend support for image optimization
 * @param imageUrl - Original image URL
 * @param width - Target width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  width?: number,
  quality: number = 85
): string => {
  // For now, return the original URL
  // This can be enhanced when image optimization is implemented
  return imageUrl;
};

/**
 * Preload critical images
 * @param imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[]): void => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
