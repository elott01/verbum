'use client';
import { useEffect } from 'react';
import { Grid } from '@/components/Grid';
import { Keyboard } from '@/components/Keyboard';
import { useGameStore } from '@/lib/store';

export default function Home() {
	const phase = useGameStore((s) => s.phase);
	const target = useGameStore((s) => s.target);
	const addLetter = useGameStore((s) => s.addLetter);
	const deleteLetter = useGameStore((s) => s.deleteLetter);
	const submitGuess = useGameStore((s) => s.submitGuess);
	const reset = useGameStore((s) => s.reset);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (phase !== 'guessing') return;
			if (e.key === 'Enter') submitGuess();
			else if (e.key === 'Backspace') deleteLetter();
			else if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [phase, addLetter, deleteLetter, submitGuess]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between gap-8 p-8">
			<h1 className="text-4xl font-bold tracking-wide">Verbum</h1>

			<Grid />

			{phase === 'round_complete' && (
				<div className="text-center">
					<p className="text-2xl font-bold text-green-600">You got it!</p>
					<button
						onClick={reset}
						className="mt-3 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
					>
						Play again
					</button>
				</div>
			)}

			{phase === 'game_over' && (
				<div className="text-center">
					<p className="text-2xl font-bold text-red-600">
						Game over — the word was {target.toUpperCase()}
					</p>
					<button
						onClick={reset}
						className="mt-3 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
					>
						Play again
					</button>
				</div>
			)}

			<Keyboard />
		</main>
	);
}
