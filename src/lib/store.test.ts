import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './store';
import { anteTargetScore } from './scoring';

const MAX_GUESSES = 6;

// 6 distinct valid guesses, none equal to "crane"
const WRONG_GUESSES = ['audio', 'raise', 'slate', 'bring', 'ghost', 'plumb'];

function submitWord(word: string) {
  const { addLetter, submitGuess } = useGameStore.getState();
  for (const ch of word) addLetter(ch);
  submitGuess();
}

function failCurrentRound() {
  for (const w of WRONG_GUESSES) submitWord(w);
}

describe('submitGuess — losing a round', () => {
  beforeEach(() => {
    useGameStore.getState().startRun('test-seed');
    // Force a deterministic target so we can craft 6 known-wrong guesses.
    useGameStore.setState({ target: 'crane', wordLength: 5 });
  });

  it('does NOT end the run when a single round is lost mid-ante', () => {
    failCurrentRound();
    const s = useGameStore.getState();
    expect(s.phase).toBe('round_complete');
    expect(s.guessesRemaining).toBe(0);
    expect(s.roundHistory).toHaveLength(1);
    expect(s.roundHistory[0]).toMatchObject({ won: false, pointsEarned: 0 });
  });

  it('advances to the next ante after a round loss if cumulative score already cleared the target', () => {
    // Simulate having already cleared ante 1's threshold via prior rounds.
    useGameStore.setState({ score: anteTargetScore(1) + 100 });
    failCurrentRound();
    expect(useGameStore.getState().phase).toBe('round_complete');

    useGameStore.getState().nextRound();
    const s = useGameStore.getState();
    // We were on ante 1 round 1; after one loss we're on round 2, still in ante 1.
    expect(s.phase).toBe('guessing');
    expect(s.ante).toBe(1);
    expect(s.round).toBe(2);
  });

  it('ends the run via nextRound only when the ante is fully played and score < target', () => {
    // Fail all 3 rounds of ante 1 with score = 0.
    for (let i = 0; i < 3; i++) {
      failCurrentRound();
      expect(useGameStore.getState().phase).toBe('round_complete');
      useGameStore.getState().nextRound();
      // After the 3rd nextRound call, the ante check should fire.
      if (i < 2) {
        useGameStore.setState({ target: 'crane', wordLength: 5, guessesRemaining: MAX_GUESSES, history: [] });
      }
    }
    const s = useGameStore.getState();
    expect(s.phase).toBe('game_over');
    expect(s.score).toBe(0);
    expect(s.roundHistory).toHaveLength(3);
    expect(s.roundHistory.every((r) => !r.won)).toBe(true);
  });
});
