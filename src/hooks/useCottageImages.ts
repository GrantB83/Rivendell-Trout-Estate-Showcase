import { useState, useEffect } from 'react';

// Static fallback images for each cottage
const fallbackImages = {
  'hobbiton': [
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop&crop=center'
  ],
  'bag-end': [
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&crop=center'
  ],
  'mirkwood': [
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&crop=center'
  ],
  'old-stone-house': [
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800&h=600&fit=crop&crop=center'
  ],
  'bucklebury': [
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=600&fit=crop&crop=center'
  ],
  'elvinbrook': [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop&crop=center'
  ]
};

// Cache to store detected images and avoid re-detection
const imageCache = new Map<string, string[]>();

// Helper function to check if an image exists
const checkImageExists = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
    
    // Timeout after 3 seconds
    setTimeout(() => resolve(false), 3000);
  });
};

// Define actual available images based on what's in the public folder
const actualImages = {
  'hobbiton': Array.from({length: 20}, (_, i) => `/hobbiton-image-${i + 1}.jpg`),
  'bag-end': Array.from({length: 10}, (_, i) => `/bag-end-image-${i + 1}.jpg`),
  'mirkwood': Array.from({length: 16}, (_, i) => `/mirkwood-image-${i + 1}.jpg`),
  'old-stone-house': Array.from({length: 23}, (_, i) => `/old-stone-house-image-${i + 1}.jpg`),
  'bucklebury': Array.from({length: 12}, (_, i) => `/bucklebury-image-${i + 1}.jpg`), 
  'elvinbrook': Array.from({length: 11}, (_, i) => `/elvinbrook-image-${i + 1}.jpg`)
};

// Function to get available images for a cottage (now instant)
const getCottageImagesSync = (cottageId: string): string[] => {
  return actualImages[cottageId as keyof typeof actualImages] || fallbackImages[cottageId as keyof typeof fallbackImages] || fallbackImages.hobbiton;
};

// Custom hook for cottage images
export const useCottageImages = (cottageId: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cottageId) {
      setImages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const images = getCottageImagesSync(cottageId);
      setImages(images);
    } catch (err) {
      setError('Failed to load images');
      const fallback = fallbackImages[cottageId as keyof typeof fallbackImages] || fallbackImages.hobbiton;
      setImages(fallback);
    } finally {
      setLoading(false);
    }
  }, [cottageId]);

  return { images, loading, error, imageCount: images.length };
};

// Synchronous function for backward compatibility
export const getCottageImages = (cottageId: string): string[] => {
  return getCottageImagesSync(cottageId);
};

// Function to preload images for all cottages (now instant)
export const preloadAllCottageImages = () => {
  // No longer needed since images are loaded synchronously
  return Promise.resolve();
};
