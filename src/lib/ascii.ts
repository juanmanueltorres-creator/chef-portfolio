export const ASCII_RAMP = '@%#*+=-:. ';

export type DitherOptions = { cellSize?: number; coverage?: number; contrast?: number; density?: number; time?: number };

const MAX_ASCII_COLUMNS = 112;
const MAX_ASCII_ROWS = 96;

/** Conservative visual-resolution cap for the photographic canvas. */
export function getAsciiGridSize(width: number, height: number, cellWidth = 8, lineHeight = 8.5) {
  if (![width, height, cellWidth, lineHeight].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError('Visual dimensions must be positive');
  }
  const columns = Math.max(24, Math.min(MAX_ASCII_COLUMNS, Math.floor(width / cellWidth)));
  const rows = Math.max(14, Math.min(MAX_ASCII_ROWS, Math.round(height / lineHeight)));
  return { columns, rows, cells: columns * rows };
}

/** Electric-Gaze-style source-colour dither: a bounded Canvas2D primitive renderer. */
export function drawDither(
  context: CanvasRenderingContext2D,
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  options: DitherOptions = {},
): void {
  const cell = options.cellSize ?? 9;
  const coverage = Math.max(0, Math.min(100, options.coverage ?? 100)) / 100;
  const contrast = (options.contrast ?? 158) / 100;
  const density = Math.max(1, Math.min(100, options.density ?? 20)) / 100;
  const time = options.time ?? 0;
  context.clearRect(0, 0, width, height);
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const i = (Math.min(height - 1, y + Math.floor(cell / 2)) * width + Math.min(width - 1, x + Math.floor(cell / 2))) * 4;
      const r = pixels[i] ?? 0, g = pixels[i + 1] ?? 0, b = pixels[i + 2] ?? 0;
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const tone = Math.max(0, Math.min(1, (lum - .5) * contrast + .5));
      const wave = Math.sin((x * .09) + (y * .05) + time * .005) * .08 * density;
      if (((x / cell + y / cell) % 1) > coverage) continue;
      const amount = Math.max(0, Math.min(1, tone + wave));
      const dots = Math.max(1, Math.round(amount * 4));
      context.fillStyle = `rgb(${Math.min(255, r + 18)},${Math.min(255, g + 18)},${Math.min(255, b + 18)})`;
      for (let d = 0; d < dots; d += 1) {
        const px = x + ((d * 2 + Math.floor(time / 90)) % Math.max(1, cell - 2)) + 1;
        const py = y + ((d * 3 + Math.floor(time / 120)) % Math.max(1, cell - 2)) + 1;
        context.beginPath();
        context.arc(px, py, Math.max(.7, amount * 1.5), 0, Math.PI * 2);
        context.fill();
      }
    }
  }
}

/** Convert row-major grayscale samples into a rectangular ASCII image. */
export function buildAsciiGrid(
  luminance: number[],
  width: number,
  height: number,
  ramp = ASCII_RAMP,
): string[] {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new RangeError('Image dimensions must be positive integers');
  }
  if (luminance.length !== width * height) {
    throw new RangeError('Sample count must match image dimensions');
  }
  if (ramp.length < 2) throw new RangeError('ASCII ramp must contain at least two glyphs');

  return Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, column) => {
      const sample = Math.max(0, Math.min(255, luminance[row * width + column] ?? 0));
      const index = Math.round((sample / 255) * (ramp.length - 1));
      return ramp[index] ?? ' ';
    }).join(''),
  );
}

function positionFraction(value: string | undefined, axis: 'x' | 'y'): number {
  if (!value) return 0.5;
  const normalized = value.toLowerCase();
  if (normalized === 'center') return 0.5;
  if (normalized === 'left') return axis === 'x' ? 0 : 0.5;
  if (normalized === 'right') return axis === 'x' ? 1 : 0.5;
  if (normalized === 'top') return axis === 'y' ? 0 : 0.5;
  if (normalized === 'bottom') return axis === 'y' ? 1 : 0.5;
  if (normalized.endsWith('%')) {
    const percent = Number.parseFloat(normalized);
    if (Number.isFinite(percent)) return Math.max(0, Math.min(1, percent / 100));
  }
  return 0.5;
}

/** Source rectangle exposed by CSS object-fit: cover at an object-position. */
export function getCoverRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  objectPosition = 'center',
) {
  if (![sourceWidth, sourceHeight, targetWidth, targetHeight].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError('Source and target dimensions must be positive');
  }
  const tokens = objectPosition.trim().split(/\s+/);
  const verticalOnly = tokens.length === 1 && ['top', 'bottom'].includes(tokens[0]?.toLowerCase() ?? '');
  const horizontal = verticalOnly ? 'center' : tokens[0];
  const vertical = tokens.length > 1 ? tokens[1] : (verticalOnly ? tokens[0] : 'center');
  const width = Math.min(sourceWidth, sourceHeight * (targetWidth / targetHeight));
  const height = Math.min(sourceHeight, sourceWidth * (targetHeight / targetWidth));
  return {
    x: (sourceWidth - width) * positionFraction(horizontal, 'x'),
    y: (sourceHeight - height) * positionFraction(vertical, 'y'),
    width,
    height,
  };
}
