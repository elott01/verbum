import type { LetterResult } from './types';

/**
 * Two-pass Wordle scoring: greens first, then yellows, decrementing a
 * per-letter pool from the target so duplicates resolve correctly.
 */
export function evaluateGuess(guess: string, target: string): LetterResult[] {
	if (guess.length !== target.length) {
		throw new Error(`Guess length (${guess.length}) must equal target length (${target.length})`);
	}

	const g = guess.toLowerCase();
	const t = target.toLowerCase();
	const result: LetterResult[] = g.split('').map((letter) => ({ letter, status: 'absent' }));
	const pool: Record<string, number> = {};

	// Pass 1: greens. Letters not consumed by a green go into the pool.
	for (let i = 0; i < t.length; i++) {
		if (g[i] === t[i]) {
			result[i].status = 'correct';
		} else {
			pool[t[i]] = (pool[t[i]] ?? 0) + 1;
		}
	}

	// Pass 2: yellows from leftover pool.
	for (let i = 0; i < g.length; i++) {
		if (result[i].status === 'correct') continue;
		if ((pool[g[i]] ?? 0) > 0) {
			result[i].status = 'present';
			pool[g[i]]--;
		}
	}

	return result;
}
