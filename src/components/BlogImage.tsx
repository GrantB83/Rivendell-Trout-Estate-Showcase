import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackDimensions: string;
  fallbackRatio: string;
}

const BlogImage = ({ src, alt, className, fallbackDimensions, fallbackRatio }: BlogImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Check if the src is a YouTube URL
  const isYouTubeUrl = src.includes('youtube.com/watch?v=');
  
  if (isYouTubeUrl) {
    // Extract video ID from YouTube URL
    const videoId = src.split('v=')[1]?.split('&')[0];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    return (
      <div className="relative group cursor-pointer">
        <img 
          src={thumbnailUrl}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageError ? 'none' : 'block' }}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all duration-300">
          <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:bg-opacity-100 transition-all duration-300">
            <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
          </div>
        </div>
        {/* Video indicator */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          VIDEO
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={`/${src}`}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageError ? 'none' : 'block' }}
      />
      {imageError && (
        <div className={`${className} bg-muted border-2 border-dashed border-border flex items-center justify-center`}>
          <div className="text-center p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Image required:</p>
            <p className="text-lg font-mono font-bold text-primary">{src}</p>
            <p className="text-xs text-muted-foreground mt-1">Recommended: {fallbackDimensions} ({fallbackRatio} ratio)</p>
            <p className="text-xs text-muted-foreground">Upload to public folder</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogImage;