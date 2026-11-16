import { MEDIA_CATALOG } from '../../../data/media'

export interface ResolvedMedia {
  src: string
  fallbackSrc: string
  alt: string
}

/**
 * Resolves a media catalog key safely with an existing fallback key
 * while parallel image generation is in progress.
 */
export function resolveMedia(
  key: string,
  fallbackKey: keyof typeof MEDIA_CATALOG
): ResolvedMedia {
  const target = MEDIA_CATALOG[key]
  const fallback = MEDIA_CATALOG[fallbackKey]
  return {
    src: target?.src ?? fallback.src,
    fallbackSrc: fallback.src,
    alt: target?.title ?? fallback.title
  }
}
