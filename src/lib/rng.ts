import seedrandom from 'seedrandom';
import { ANSWER_WORDS } from './words';

/**
 * Returns the word for a given ante + round, always deterministic from the seed.
 * Ante and round are 1-indexed.
 */
export function pickWord(seed: string, ante: number, round: number): string {
  const rng = seedrandom(`${seed}:${ante}:${round}`);
  const index = Math.floor(rng() * ANSWER_WORDS.length);
  return ANSWER_WORDS[index];
}