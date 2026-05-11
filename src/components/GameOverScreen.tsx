'use client';
import { useGameStore } from '@/lib/store';

export function GameOverScreen() {
  const target = useGameStore((s) => s.target);
  const score = useGameStore((s) => s.score);
  const targetScore = useGameStore((s) => s.targetScore);
  const roundHistory = useGameStore((s) => s.roundHistory);
  const startRun = useGameStore((s) => s.startRun);

  const won = roundHistory.filter((r) => r.won).length;

  return (
    <div className="text-center space-y-3">
      <p className="text-2xl font-bold text-red-600">Game Over</p>
      <p className="text-base">The word was <span className="font-bold">{target.toUpperCase()}</span></p>
      <p className="text-base">Score: {score} / {targetScore} needed</p>
      <p className="text-sm text-gray-500">{won} of {roundHistory.length} rounds won</p>
      <button
        onClick={() => startRun()}
        className="mt-3 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
      >
        New Run
      </button>
    </div>
  );
}