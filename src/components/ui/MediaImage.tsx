import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { getImage, type MediaKey } from '@/data/media';
import { cn } from '@/lib/cn';

interface MediaImageProps {
  media: MediaKey;
  locale: Locale;
  /** Required when `fill` is used — describe the rendered width, e.g. `(min-width: 768px) 50vw, 100vw`. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** `fill` covers a positioned parent; `intrinsic` keeps the aspect ratio. */
  fill?: boolean;
  quality?: number;
}

/**
 * Every image on the site goes through this component so that:
 *   • alt text always exists and is localised,
 *   • width/height always come from the real file (zero layout shift),
 *   • the blur placeholder is applied automatically when one exists,
 *   • the right `sizes` hint is passed so the browser never downloads a
 *     2560px image for a 320px phone.
 */
export function MediaImage({
  media,
  locale,
  sizes = '100vw',
  priority = false,
  className,
  fill = true,
  quality = 82,
}: MediaImageProps) {
  const image = getImage(media);

  return (
    <Image
      src={image.src}
      alt={image.alt[locale]}
      {...(fill
        ? { fill: true }
        : { width: image.width, height: image.height })}
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder={image.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={image.blurDataURL}
      className={cn(fill && 'object-cover', className)}
    />
  );
}
