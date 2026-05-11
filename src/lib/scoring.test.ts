import { describe, it, expect } from 'vitest';
import { calculateScore, anteTargetScore } from './scoring';
import { evaluateGuess } from './evaluateGuess';

describe('calculateScore', () => {
  it('gives more points for fewer guesses used', () => {
    const result = evaluateGuess('crane', 'crane'); // all green
    const fastScore = calculateScore(result, 5); // solved on guess 1
    const slowScore = calculateScore(result, 0); // solved on guess 6
    expect(fastScore).toBeGreaterThan(slowScore);
  });

  it('returns 0 speed bonus when no guesses remain', () => {
    const result = evaluateGuess('crane', 'crane');
    const score = calculateScore(result, 0);
    // Should still have letter points
    expect(score).toBeGreaterThan(0);
  });

  it('counts yellow letters lower than green', () => {
    const allGreen = evaluateGuess('crane', 'crane');
    // Build a fake all-yellow result
    const allYellow = allGreen.map((r) => ({ ...r, status: 'present' as const }));
    expect(calculateScore(allGreen, 0)).toBeGreaterThan(calculateScore(allYellow, 0));
  });
});

describe('anteTargetScore', () => {
  it('increases with each ante', () => {
    expect(anteTargetScore(2)).toBeGreaterThan(anteTargetScore(1));
    expect(anteTargetScore(3)).toBeGreaterThan(anteTargetScore(2));
  });
});