import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Monster, StableEntry } from '../types';
import { loadMonster, saveMonster, clearMonster, addToStable, loadTotalWins, saveTotalWins } from '../storage/persistence';
import { applyTimeDecay } from '../logic/timeDecay';
import { toStableEntry } from '../logic/createMonster';

const TICK_INTERVAL_MS = 10_000; // 10 seconds

export interface MonsterHook {
  monster: Monster | null;
  totalWins: number;
  loading: boolean;
  setMonster: (m: Monster) => void;
  retireMonster: () => Promise<StableEntry>;
  sessionStart: number;
}

export function useMonster(): MonsterHook {
  const [monster, setMonsterState] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalWins, setTotalWins] = useState(0);
  const sessionStart = useRef(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist whenever monster changes
  const setMonster = useCallback((m: Monster) => {
    setMonsterState(m);
    saveMonster(m);
  }, []);

  const tick = useCallback((current: Monster | null) => {
    if (!current || current.lifecycleStage === 'dead') return;
    const now = Date.now();
    const updated = applyTimeDecay(current, now);
    setMonsterState(updated);
    saveMonster(updated);
  }, []);

  // Load on mount
  useEffect(() => {
    (async () => {
      const [saved, wins] = await Promise.all([loadMonster(), loadTotalWins()]);
      if (saved) {
        const now = Date.now();
        const updated = applyTimeDecay(saved, now);
        setMonsterState(updated);
        saveMonster(updated);
      }
      setTotalWins(wins);
      setLoading(false);
    })();
  }, []);

  // Tick every 10s
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setMonsterState((current) => {
        if (!current || current.lifecycleStage === 'dead') return current;
        const now = Date.now();
        const updated = applyTimeDecay(current, now);
        saveMonster(updated);
        return updated;
      });
    }, TICK_INTERVAL_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Re-apply decay when app comes back to foreground
  useEffect(() => {
    const handler = (state: AppStateStatus) => {
      if (state === 'active') {
        setMonsterState((current) => {
          if (!current || current.lifecycleStage === 'dead') return current;
          const now = Date.now();
          const updated = applyTimeDecay(current, now);
          saveMonster(updated);
          return updated;
        });
      }
    };
    const sub = AppState.addEventListener('change', handler);
    return () => sub.remove();
  }, []);

  const retireMonster = useCallback(async (): Promise<StableEntry> => {
    if (!monster) throw new Error('No monster to retire');
    const entry = toStableEntry(monster);
    await addToStable(entry);
    await clearMonster();
    const newWins = totalWins + monster.wins;
    await saveTotalWins(newWins);
    setTotalWins(newWins);
    setMonsterState(null);
    return entry;
  }, [monster, totalWins]);

  return {
    monster,
    totalWins,
    loading,
    setMonster,
    retireMonster,
    sessionStart: sessionStart.current,
  };
}
