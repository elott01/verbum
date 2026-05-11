'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store';

export function SeedLoader() {
  const searchParams = useSearchParams();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    const seed = searchParams.get('seed');
    if (seed) {
      applied.current = true;
      useGameStore.getState().startRun(seed);
    }
  }, [searchParams]);

  return null;
}
