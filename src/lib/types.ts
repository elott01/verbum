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

// New: describes one completed round
export type RoundResult = {
  word: string;
  guessesUsed: number;   // out of MAX_GUESSES
  pointsEarned: number;
  won: boolean;
};

export type RunState = {
  seed: string;
  ante: number;          // current ante (starts at 1)
  round: number;         // 1-indexed round within the ante (1–3)
  targetScore: number;   // score needed to clear this ante
  score: number;         // cumulative score for the run
  roundHistory: RoundResult[];

  // active round
  target: string;
  wordLength: number;
  guessesRemaining: number;
  history: Guess[];
  currentGuess: string;
  phase: Phase;
  lastRoundPoints: number | null;  // shown on round_complete screen
};