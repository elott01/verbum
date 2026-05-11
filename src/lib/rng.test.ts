import { describe, it, expect } from 'vitest';
import { pickWord } from './rng';

describe('pickWord', () => {
  it('is deterministic for the same inputs', () => {
    expect(pickWord('test-seed', 1, 1)).toBe(pickWord('test-seed', 1, 1));
  });

  it('produces different words for different rounds', () => {
    const r1 = pickWord('test-seed', 1, 1);
    const r2 = pickWord('test-seed', 1, 2);
    const r3 = pickWord('test-seed', 1, 3);
    // Not guaranteed unique, but extremely unlikely to collide
    expect(new Set([r1, r2, r3]).size).toBeGreaterThan(1);
  });

  it('produces different words for different seeds', () => {
    expect(pickWord('seed-a', 1, 1)).not.toBe(pickWord('seed-b', 1, 1));
  });
});