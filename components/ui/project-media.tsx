import Image from 'next/image';
import type { ProjectImage } from '@/lib/schemas/project';
import { cn } from '@/lib/utils/cn';
import { PlaceholderVisual } from './placeholder-visual';

/** Real screenshot when available, otherwise the gradient placeholder mockup. */
export function ProjectMedia({
  image,
  hue,
  label,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority,
  quality,
  decorative,
  className,
}: {
  image?: ProjectImage;
  hue?: number;
  label: string;
  sizes?: string;
  priority?: boolean;
  quality?: 60 | 75;
  /** The surrounding <figcaption> already names the image, so it gets an empty alt. */
  decorative?: boolean;
  className?: string;
}) {
  if (!image) return <PlaceholderVisual hue={hue} label={label} className={className} />;

  return (
    <Image
      src={image.src}
      width={image.width}
      height={image.height}
      alt={decorative ? '' : label}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={cn('h-auto w-full object-cover object-top', className)}
    />
  );
}
