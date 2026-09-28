import { useEffect, useRef, useState } from 'react';
import { buildAsciiGrid, drawDither, getAsciiGridSize, getCoverRect } from '../lib/ascii';

type AsciiImageProps = {
  src: string;
  alt: string;
  className?: string;
  position?: string;
  caption?: string;
};

export function AsciiImage({ src, alt, className = '', position = 'center', caption }: AsciiImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const revealed = hovered || focused || pinned;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const image = wrapper?.querySelector('img');
    if (!wrapper || !canvas || !image) return;
    let observer: IntersectionObserver | undefined;
    let disposed = false;
    let animation = 0;
    let ditherPixels: Uint8ClampedArray | undefined;
    let ditherWidth = 0;
    let ditherHeight = 0;
    let context: CanvasRenderingContext2D | null = null;
    let isVisible = false;
    let activated = false;
    let running = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      if (!image.complete) return;
      if (image.naturalWidth === 0 || image.naturalHeight === 0) {
        setFailed(true);
        return;
      }
      context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      const ctx = context;
      const fontSize = 8;
      const lineHeight = 8.5;
      ctx.font = `${fontSize}px monospace`;
      const cellWidth = ctx.measureText('M').width;
      const { columns, rows } = getAsciiGridSize(wrapper.clientWidth, wrapper.clientHeight, cellWidth, lineHeight);
      const pixelWidth = columns;
      const pixelHeight = rows;
      const crop = getCoverRect(image.naturalWidth, image.naturalHeight, pixelWidth, pixelHeight, position);

      // Keep the internal raster compact; CSS scales each sampled cell to the visual cell size.
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, pixelWidth, pixelHeight);
      try {
        const { data } = ctx.getImageData(0, 0, pixelWidth, pixelHeight);
        const luminance = Array.from({ length: pixelWidth * pixelHeight }, (_, index) => {
          const offset = index * 4;
          return 0.2126 * data[offset]! + 0.7152 * data[offset + 1]! + 0.0722 * data[offset + 2]!;
        });
        const lines = buildAsciiGrid(luminance, pixelWidth, pixelHeight);
        ditherPixels = data;
        ditherWidth = pixelWidth;
        ditherHeight = pixelHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#e2daca';
        lines.forEach((line, row) => {
          for (let column = 0; column < pixelWidth; column += 1) {
            ctx.fillText(line[column] ?? ' ', column, row);
          }
        });
        // Electric-Gaze accent: source-colour dither with a restrained shimmer.
        drawDither(ctx, data, pixelWidth, pixelHeight, { cellSize: 1, contrast: 158, density: 20, time: 0 });
        if (!disposed) {
          setFailed(false);
          setReady(true);
        }
      } catch {
        // Keep the color photograph visible when canvas sampling is unavailable.
        if (!disposed) setFailed(true);
      }
    };
    const animate = (time: number) => {
      if (disposed || !isVisible || reducedMotion || document.visibilityState !== 'visible') {
        running = false;
        return;
      }
      if (context && ditherPixels) {
        drawDither(context, ditherPixels, ditherWidth, ditherHeight, { cellSize: 1, contrast: 158, density: 20, time });
      }
      animation = requestAnimationFrame(animate);
    };
    const startAnimation = () => {
      if (!running && !reducedMotion && isVisible && document.visibilityState === 'visible') {
        running = true;
        animation = requestAnimationFrame(animate);
      }
    };
    const activate = () => {
      if (activated) return;
      activated = true;
      if (image.complete) draw();
      else image.addEventListener('load', draw, { once: true });
    };
    const onError = () => { if (!disposed) setFailed(true); };
    image.addEventListener('error', onError);
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            activate();
            startAnimation();
          } else {
            running = false;
            cancelAnimationFrame(animation);
          }
        });
      }, { rootMargin: '140px' });
      observer.observe(wrapper);
    } else activate();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') startAnimation();
      else {
        running = false;
        cancelAnimationFrame(animation);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    const resize = () => { if (ready) draw(); };
    window.addEventListener('resize', resize, { passive: true });
    return () => {
      disposed = true;
      cancelAnimationFrame(animation);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      image.removeEventListener('load', draw);
      image.removeEventListener('error', onError);
    };
  }, [position, ready, src]);

  return (
    <figure
      ref={wrapperRef}
      className={`ascii-image ${className}${ready && !failed ? ' ascii-image--ready' : ''}${failed ? ' ascii-image--fallback' : ''}${revealed ? ' is-revealed' : ''}`}
      style={{ '--image-position': position } as React.CSSProperties}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHovered(false); }}
    >
      <img src={src} alt={alt} loading="lazy" />
      <canvas ref={canvasRef} aria-hidden="true" />
      <button
        type="button"
        className="ascii-image__toggle"
        aria-label={`${pinned ? 'Volver al dither de' : 'Revelar la fotografía de'} ${alt}`}
        aria-pressed={pinned}
        onClick={() => setPinned((value) => !value)}
        onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setFocused(true); }}
        onBlur={() => setFocused(false)}
      >
        DITHER <span aria-hidden="true">/</span> FOTO
      </button>
      {caption && <figcaption className="ascii-image__caption">{caption}</figcaption>}
    </figure>
  );
}
