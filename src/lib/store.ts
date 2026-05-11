import { create } from 'zustand';
import { evaluateGuess } from './evaluateGuess';
import type { RunState } from './types';

const TARGET = 'crane'; // hardcoded for Day 1
const WORD_LENGTH = TARGET.length;
const MAX_GUESSES = 6;

type Actions = {
	addLetter: (letter: string) => void;
	deleteLetter: () => void;
	submitGuess: () => void;
	reset: () => void;
};

const initialState: RunState = {
	target: TARGET,
	wordLength: WORD_LENGTH,
	guessesRemaining: MAX_GUESSES,
	history: [],
	currentGuess: '',
	phase: 'guessing',
};

export const useGameStore = create<RunState & Actions>((set) => ({
	...initialState,

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

			const result = evaluateGuess(state.currentGuess, state.target);
			const history = [...state.history, { word: state.currentGuess, result }];
			const guessesRemaining = state.guessesRemaining - 1;
			const won = result.every((r) => r.status === 'correct');

			const phase: RunState['phase'] = won
				? 'round_complete'
				: guessesRemaining === 0
					? 'game_over'
					: 'guessing';

			return { history, currentGuess: '', guessesRemaining, phase };
		}),

	reset: () => set(initialState),
}));
