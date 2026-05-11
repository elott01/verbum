'use client';
import { useGameStore } from '@/lib/store';

export function RoundCompleteScreen() {
  const score = useGameStore((s) => s.score);
  const targetScore = useGameStore((s) => s.targetScore);
  const ante = useGameStore((s) => s.ante);
  const round = useGameStore((s) => s.round);
  const lastRoundPoints = useGameStore((s) => s.lastRoundPoints);
  const roundHistory = useGameStore((s) => s.roundHistory);
  const target = useGameStore((s) => s.target);
  const nextRound = useGameStore((s) => s.nextRound);

  const lastRound = roundHistory[roundHistory.length - 1];
  const won = lastRound?.won ?? true;

  return (
    <div className="text-center space-y-3">
      {won ? (
        <p className="text-2xl font-bold text-green-600">Round {round} complete!</p>
      ) : (
        <>
          <p className="text-2xl font-bold text-red-600">Round {round} failed</p>
          <p className="text-base">The word was <span className="font-bold">{target.toUpperCase()}</span></p>
        </>
      )}
      <p className="text-lg">+{lastRoundPoints} points</p>
      <p className="text-base">Score: {score} / {targetScore} needed</p>
      <p className="text-sm text-gray-500">Ante {ante} · Round {round} of 3</p>
      <button
        onClick={nextRound}
        className={`mt-3 rounded px-6 py-2 font-semibold text-white ${
          won ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Next Round
      </button>
    </div>
  );
}
