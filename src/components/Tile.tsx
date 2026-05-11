import type { LetterResult } from '@/lib/types';

const STATUS_CLASSES: Record<LetterResult['status'], string> = {
	correct: 'bg-green-600 border-green-600 text-white',
	present: 'bg-yellow-500 border-yellow-500 text-white',
	absent: 'bg-gray-600 border-gray-600 text-white',
};

export function Tile({ letter, status }: { letter?: string; status?: LetterResult['status'] }) {
	const classes = status
		? STATUS_CLASSES[status]
		: letter
			? 'border-gray-500 text-black dark:text-white'
			: 'border-gray-300 dark:border-gray-700';
	return (
		<div
			className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase ${classes}`}
		>
			{letter ?? ''}
		</div>
	);
}
