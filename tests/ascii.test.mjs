import assert from 'node:assert/strict';
import test from 'node:test';

let buildAsciiGrid;
let getCoverRect;
let getAsciiGridSize;
try {
  ({ buildAsciiGrid, getCoverRect, getAsciiGridSize } = await import('../src/lib/ascii.ts'));
} catch {
  // Keep the initial RED as an assertion about the missing behavior, not a module-load error.
}

test('buildAsciiGrid maps darker pixels to denser glyphs and preserves dimensions', () => {
  assert.equal(typeof buildAsciiGrid, 'function', 'the ASCII renderer is available');
  assert.deepEqual(buildAsciiGrid([0, 255, 255, 0], 2, 2), ['@ ', ' @']);
});

test('buildAsciiGrid validates that the sample count matches its dimensions', () => {
  assert.throws(() => buildAsciiGrid([0, 255], 2, 2), /sample count/i);
});

test('getCoverRect crops a landscape source to the centered portrait viewport', () => {
  assert.deepEqual(getCoverRect(1600, 900, 400, 600), {
    x: 500, y: 0, width: 600, height: 900,
  });
});

test('getCoverRect respects CSS percentage position when selecting the visible source crop', () => {
  assert.deepEqual(getCoverRect(1600, 900, 400, 600, '75% 40%'), {
    x: 750, y: 0, width: 600, height: 900,
  });
});

test('getAsciiGridSize raises the conservative detail cap without exceeding it', () => {
  assert.equal(typeof getAsciiGridSize, 'function', 'the adaptive canvas sizing helper is available');
  assert.deepEqual(getAsciiGridSize(1200, 900), { columns: 112, rows: 96, cells: 10752 });
  assert.deepEqual(getAsciiGridSize(320, 240), { columns: 40, rows: 28, cells: 1120 });
});
