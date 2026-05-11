export type LetterStatus = 'correct' | 'present' | 'absent';

export type LetterResult = {
	letter: string;
	status: LetterStatus;
};

export type Guess = {
	word: string;
	result: LetterResult[];
};

export type Phase = 'guessing' | 'round_complete' | 'game_over';

export type RunState = {
	target: string;
	wordLength: number;
	guessesRemaining: number;
	history: Guess[];
	currentGuess: string;
	phase: Phase;
};
