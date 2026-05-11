'use client';
import { Suspense, useEffect } from 'react';
import { Grid } from '@/components/Grid';
import { Keyboard } from '@/components/Keyboard';
import { RoundCompleteScreen } from '@/components/RoundCompleteScreen';
import { GameOverScreen } from '@/components/GameOverScreen';
import { SeedLoader } from '@/components/SeedLoader';
import { useGameStore } from '@/lib/store';

export default function Home() {
  const phase = useGameStore((s) => s.phase);
  const ante = useGameStore((s) => s.ante);
  const round = useGameStore((s) => s.round);
  const score = useGameStore((s) => s.score);
  const targetScore = useGameStore((s) => s.targetScore);
  const target = useGameStore((s) => s.target);
  const seed = useGameStore((s) => s.seed);
  const addLetter = useGameStore((s) => s.addLetter);
  const deleteLetter = useGameStore((s) => s.deleteLetter);
  const submitGuess = useGameStore((s) => s.submitGuess);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[debug] run seed:`, seed);
    }
  }, [seed]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[debug] target word (ante ${ante}, round ${round}):`, target);
    }
  }, [target, ante, round]);

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
      <Suspense fallback={null}>
        <SeedLoader />
      </Suspense>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-wide">Verbum</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ante {ante} · Round {round}/3 · Score: {score} / {targetScore}
        </p>
      </div>

      <Grid />

      {phase === 'round_complete' && <RoundCompleteScreen />}
      {phase === 'game_over' && <GameOverScreen />}

      <Keyboard />
    </main>
  );
}