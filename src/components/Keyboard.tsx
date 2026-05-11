'use client';
import { useGameStore } from '@/lib/store';

const ROWS: string[][] = [
	'qwertyuiop'.split(''),
	'asdfghjkl'.split(''),
	['enter', ...'zxcvbnm'.split(''), 'back'],
];

export function Keyboard() {
	const addLetter = useGameStore((s) => s.addLetter);
	const deleteLetter = useGameStore((s) => s.deleteLetter);
	const submitGuess = useGameStore((s) => s.submitGuess);

	const handle = (key: string) => {
		if (key === 'enter') submitGuess();
		else if (key === 'back') deleteLetter();
		else addLetter(key);
	};

	return (
		<div className="flex flex-col gap-2 items-center select-none">
			{ROWS.map((row, i) => (
				<div key={i} className="flex gap-1">
					{row.map((key) => {
						const wide = key === 'enter' || key === 'back';
						return (
							<button
								key={key}
								onClick={() => handle(key)}
								className={`bg-gray-300 hover:bg-gray-400 text-black font-semibold uppercase rounded py-4 ${
									wide ? 'px-3 text-sm' : 'px-3 min-w-[2.25rem]'
								}`}
							>
								{key === 'back' ? '⌫' : key}
							</button>
						);
					})}
				</div>
			))}
		</div>
	);
}
