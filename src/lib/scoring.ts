const BASE_PER_GREEN = 100;
const BASE_PER_YELLOW = 40;
const GUESS_BONUS_MULTIPLIER = 50; // bonus per guess remaining after the winning guess

/**
 * Calculates points earned for a successful round.
 * Losing a round earns 0 points.
 */
export function calculateScore(
  result: import('./types').LetterResult[],
  guessesRemaining: number  // remaining AFTER the winning guess is consumed
): number {
  const letterPoints = result.reduce((sum, r) => {
    if (r.status === 'correct') return sum + BASE_PER_GREEN;
    if (r.status === 'present') return sum + BASE_PER_YELLOW;
    return sum;
  }, 0);

  const speedBonus = guessesRemaining * GUESS_BONUS_MULTIPLIER;
  return letterPoints + speedBonus;
}

/**
 * Target score to clear an ante.
 * Scales so ante 1 is achievable with average play, later antes require efficiency.
 */
export function anteTargetScore(ante: number): number {
  return 800 + (ante - 1) * 400;
}