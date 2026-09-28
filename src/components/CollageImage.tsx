type CollageImageProps = {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  caption?: string;
  loading?: 'eager' | 'lazy';
};

export function CollageImage({ src, alt, className = '', position = 'center', caption, loading = 'lazy' }: CollageImageProps) {
  return (
    <figure className={`collage-image ${className}`} style={{ '--image-position': position } as React.CSSProperties}>
      <img src={src} alt={alt} loading={loading} fetchPriority={loading === 'eager' ? 'high' : 'auto'} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
