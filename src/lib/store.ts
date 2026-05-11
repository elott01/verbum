import { create } from 'zustand';
import { evaluateGuess } from './evaluateGuess';
import { calculateScore, anteTargetScore } from './scoring';
import { pickWord } from './rng';
import { VALID_WORDS } from './words';
import type { RunState, RoundResult } from './types';

const MAX_GUESSES = 6;
const ROUNDS_PER_ANTE = 3;

function generateSeed(): string {
  return Date.now().toString(36);
}

function makeInitialState(seed: string): RunState {
  const ante = 1;
  const round = 1;
  const target = pickWord(seed, ante, round);
  return {
    seed,
    ante,
    round,
    targetScore: anteTargetScore(ante),
    score: 0,
    roundHistory: [],
    target,
    wordLength: target.length,
    guessesRemaining: MAX_GUESSES,
    history: [],
    currentGuess: '',
    phase: 'guessing',
    lastRoundPoints: null,
  };
}

type Actions = {
  startRun: (seed?: string) => void;
  addLetter: (letter: string) => void;
  deleteLetter: () => void;
  submitGuess: () => void;
  nextRound: () => void;  // called from the round_complete screen
};

export const useGameStore = create<RunState & Actions>((set) => ({
  ...makeInitialState(generateSeed()),

  startRun: (seed) => set(makeInitialState(seed ?? generateSeed())),

  addLetter: (letter) =>
    set((state) => {
      if (state.phase !== 'guessing') return state;
      if (state.currentGuess.length >= state.wordLength) return state;
      if (!/^[a-zA-Z]$/.test(letter)) return state;
      return { currentGuess: state.currentGuess + letter.toLowerCase() };
    }),

  deleteLetter: () =>
    set((state) => {
      if (state.phase !== 'guessing') return state;
      return { currentGuess: state.currentGuess.slice(0, -1) };
    }),

  submitGuess: () =>
    set((state) => {
      if (state.phase !== 'guessing') return state;
      if (state.currentGuess.length !== state.wordLength) return state;
      if (!VALID_WORDS.has(state.currentGuess)) return state; // invalid word — no state change

      const result = evaluateGuess(state.currentGuess, state.target);
      const history = [...state.history, { word: state.currentGuess, result }];
      const guessesRemaining = state.guessesRemaining - 1;
      const won = result.every((r) => r.status === 'correct');

      if (won) {
        const points = calculateScore(result, guessesRemaining);
        const newScore = state.score + points;
        const roundResult: RoundResult = {
          word: state.target,
          guessesUsed: MAX_GUESSES - guessesRemaining,
          pointsEarned: points,
          won: true,
        };
        return {
          history,
          currentGuess: '',
          guessesRemaining,
          phase: 'round_complete',
          score: newScore,
          roundHistory: [...state.roundHistory, roundResult],
          lastRoundPoints: points,
        };
      }

      if (guessesRemaining === 0) {
        const roundResult: RoundResult = {
          word: state.target,
          guessesUsed: MAX_GUESSES,
          pointsEarned: 0,
          won: false,
        };
        return {
          history,
          currentGuess: '',
          guessesRemaining,
          phase: 'round_complete',
          roundHistory: [...state.roundHistory, roundResult],
          lastRoundPoints: 0,
        };
      }

      return { history, currentGuess: '', guessesRemaining };
    }),

  nextRound: () =>
    set((state) => {
      const nextRound = state.round + 1;

      if (nextRound > ROUNDS_PER_ANTE) {
        // Ante clear check
        if (state.score < state.targetScore) {
          // Failed to reach target — game over
          return { phase: 'game_over' };
        }
        // Advance to next ante
        const nextAnte = state.ante + 1;
        const target = pickWord(state.seed, nextAnte, 1);
        return {
          ante: nextAnte,
          round: 1,
          targetScore: anteTargetScore(nextAnte),
          target,
          wordLength: target.length,
          guessesRemaining: MAX_GUESSES,
          history: [],
          currentGuess: '',
          phase: 'guessing',
          lastRoundPoints: null,
        };
      }

      // Next round in same ante
      const target = pickWord(state.seed, state.ante, nextRound);
      return {
        round: nextRound,
        target,
        wordLength: target.length,
        guessesRemaining: MAX_GUESSES,
        history: [],
        currentGuess: '',
        phase: 'guessing',
        lastRoundPoints: null,
      };
    }),
}));