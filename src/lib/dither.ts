export type DitherCell = { x: number; y: number; r: number; g: number; b: number; coverage: number };

export function applyContrast(value: number, contrastPercent: number): number {
  const clamped = Math.max(0, Math.min(255, value));
  const factor = Math.max(0, contrastPercent) / 100;
  return Math.round(Math.max(0, Math.min(255, ((clamped / 255 - 0.5) * factor + 0.5) * 255)));
}

/** Convert a low-resolution, row-major photo sample into colored halftone cells. */
export function buildDitherCells(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  cellSize: number,
  contrastPercent: number,
  density: number,
): DitherCell[] {
  if (![width, height, cellSize].every((value) => Number.isInteger(value) && value > 0)) {
    throw new RangeError('Grid dimensions and cell size must be positive integers');
  }
  if (pixels.length !== width * height * 4) {
    throw new RangeError('Pixel count must match sample dimensions');
  }
  const densityRatio = Math.max(0, Math.min(100, density)) / 100;
  return Array.from({ length: width * height }, (_, index) => {
    const offset = index * 4;
    const r = applyContrast(pixels[offset] ?? 0, contrastPercent);
    const g = applyContrast(pixels[offset + 1] ?? 0, contrastPercent);
    const b = applyContrast(pixels[offset + 2] ?? 0, contrastPercent);
    const luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    const darkness = 1 - luminance / 255;
    return {
      x: (index % width) * cellSize,
      y: Math.floor(index / width) * cellSize,
      r,
      g,
      b,
      coverage: Math.round(darkness * densityRatio * 16),
    };
  });
}

/** Stable spatial shimmer phase, shared by screenshots and reduced-motion frames. */
export function shimmerValue(x: number, y: number, timeMs: number): number {
  const phase = (x * 0.19) + (y * 0.13) - (timeMs * 0.0042);
  return (Math.sin(phase) + 1) / 2;
}
