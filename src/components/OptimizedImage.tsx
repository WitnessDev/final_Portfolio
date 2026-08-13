import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  widthParam?: number;
  qualityParam?: number;
  priority?: boolean;
}

/**
 * Transforms Unsplash URLs to request optimized WebP format with controlled dimensions.
 */
export const getOptimizedImageUrl = (url: string, width = 800, quality = 80): string => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('q', quality.toString());
      parsed.searchParams.set('w', width.toString());
      parsed.searchParams.set('fm', 'webp');
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  widthParam = 800,
  qualityParam = 80,
  priority = false,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, widthParam, qualityParam);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center z-1">
          <div className="w-6 h-6 border-2 border-white/20 border-t-[#EED98A] rounded-full animate-spin" />
        </div>
      )}

      {/* Fallback if load fails */}
      {hasError && (
        <div className="absolute inset-0 bg-neutral-900 border border-white/10 flex items-center justify-center p-2 text-center z-1">
          <span className="text-[10px] text-neutral-500 font-mono">Image Unavailable</span>
        </div>
      )}

      {/* Optimized Main Image */}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
