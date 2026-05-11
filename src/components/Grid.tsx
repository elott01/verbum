'use client';
import { Tile } from './Tile';
import { useGameStore } from '@/lib/store';

export function Grid() {
	const history = useGameStore((s) => s.history);
	const currentGuess = useGameStore((s) => s.currentGuess);
	const wordLength = useGameStore((s) => s.wordLength);
	const guessesRemaining = useGameStore((s) => s.guessesRemaining);
	const phase = useGameStore((s) => s.phase);

	const rows: Array<{
		key: string;
		letters: Array<{ letter?: string; status?: 'correct' | 'present' | 'absent' }>;
	}> = [];

	// Submitted guesses
	history.forEach((g, i) =>
		rows.push({
			key: `h-${i}`,
			letters: g.result.map((r) => ({ letter: r.letter, status: r.status })),
		}),
	);

	// Active row (only while guessing)
	if (phase === 'guessing') {
		rows.push({
			key: 'active',
			letters: Array.from({ length: wordLength }, (_, i) => ({ letter: currentGuess[i] })),
		});
	}

	// Empty rows for remaining guesses (excluding the active one we just added)
	const emptyCount = phase === 'guessing' ? guessesRemaining - 1 : guessesRemaining;
	for (let i = 0; i < emptyCount; i++) {
		rows.push({
			key: `e-${i}`,
			letters: Array.from({ length: wordLength }, () => ({})),
		});
	}

	return (
		<div className="flex flex-col gap-2">
			{rows.map((row) => (
				<div key={row.key} className="flex gap-2">
					{row.letters.map((cell, j) => (
						<Tile key={j} letter={cell.letter} status={cell.status} />
					))}
				</div>
			))}
		</div>
	);
}
