import assert from 'node:assert/strict';
import test from 'node:test';

const dither = await import('../src/lib/dither.ts').catch(() => ({}));

test('applyContrast applies the preset contrast around the neutral midpoint', () => {
  assert.equal(dither.applyContrast(80, 158), 52);
  assert.equal(dither.applyContrast(128, 158), 128);
});

test('buildDitherCells produces repeatable luminance-dependent density from source pixels', () => {
  const pixels = new Uint8ClampedArray([128, 128, 128, 255]);
  const first = dither.buildDitherCells(pixels, 1, 1, 9, 158, 20);
  const second = dither.buildDitherCells(pixels, 1, 1, 9, 158, 20);
  assert.deepEqual(first, second);
  assert.equal(first.length, 1);
  assert.equal(first[0].coverage, 2);
  assert.equal(first[0].r, 128);
});

test('shimmerValue is deterministic for a frame and changes over time', () => {
  const start = dither.shimmerValue(4, 9, 0);
  assert.equal(start, dither.shimmerValue(4, 9, 0));
  assert.notEqual(start, dither.shimmerValue(4, 9, 600));
});
