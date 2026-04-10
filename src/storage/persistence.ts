import AsyncStorage from '@react-native-async-storage/async-storage';
import { Monster, StableEntry } from '../types';

const KEYS = {
  MONSTER: '@beastwarden/monster',
  STABLE: '@beastwarden/stable',
  TOTAL_WINS: '@beastwarden/total_wins',
};

export async function loadMonster(): Promise<Monster | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.MONSTER);
    if (!raw) return null;
    return JSON.parse(raw) as Monster;
  } catch {
    return null;
  }
}

export async function saveMonster(monster: Monster): Promise<void> {
  await AsyncStorage.setItem(KEYS.MONSTER, JSON.stringify(monster));
}

export async function clearMonster(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.MONSTER);
}

export async function loadStable(): Promise<StableEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STABLE);
    if (!raw) return [];
    return JSON.parse(raw) as StableEntry[];
  } catch {
    return [];
  }
}

export async function addToStable(entry: StableEntry): Promise<void> {
  const existing = await loadStable();
  existing.unshift(entry);
  await AsyncStorage.setItem(KEYS.STABLE, JSON.stringify(existing));
}

export async function loadTotalWins(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TOTAL_WINS);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export async function saveTotalWins(wins: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.TOTAL_WINS, String(wins));
}
