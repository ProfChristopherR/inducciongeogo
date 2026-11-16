import React from 'react'
import type { MEDIA_CATALOG } from '../../../data/media'
import { resolveMedia } from '../utils/mediaFallback'

interface SafeMediaImageProps {
  mediaKey: string
  fallbackKey: keyof typeof MEDIA_CATALOG
  alt?: string
  className?: string
}

export const SafeMediaImage: React.FC<SafeMediaImageProps> = ({
  mediaKey,
  fallbackKey,
  alt,
  className = 'h-full w-full object-cover'
}) => {
  const resolved = resolveMedia(mediaKey, fallbackKey)

  return (
    <img
      src={resolved.src}
      alt={alt ?? resolved.alt}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src !== resolved.fallbackSrc) {
          e.currentTarget.src = resolved.fallbackSrc
        }
      }}
    />
  )
}
