import { Monster, MonsterStats, StableEntry } from '../types';
import { getSpecies } from '../constants/species';

export function createMonster(
  name: string,
  speciesId: string,
  inheritedBonus?: Partial<MonsterStats>
): Monster {
  const species = getSpecies(speciesId);
  if (!species) throw new Error(`Unknown species: ${speciesId}`);

  const base = { ...species.baseStats };
  if (inheritedBonus) {
    for (const [key, val] of Object.entries(inheritedBonus)) {
      const k = key as keyof MonsterStats;
      base[k] = Math.min(999, base[k] + (val ?? 0));
    }
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    species: speciesId,
    spriteColor: species.spriteColor,
    age: 0,
    lifespan: species.lifespan,
    lifecycleStage: 'egg',
    stats: base,
    mood: 80,
    hunger: 80,
    fatigue: 0,
    lastUpdated: Date.now(),
    trainCooldowns: {},
    starvingHours: 0,
    depressedHours: 0,
    wins: 0,
    inheritedBonus,
  };
}

/** Derive a StableEntry from a dead monster */
export function toStableEntry(monster: Monster): StableEntry {
  return {
    id: monster.id,
    name: monster.name,
    species: monster.species,
    ageAtDeath: monster.age,
    peakStats: monster.stats,
    stats: monster.stats,
    diedAt: Date.now(),
    wins: monster.wins,
  };
}

/** Compute inherited bonus stats (5% of peak stats, rounded) */
export function computeInheritedBonus(entry: StableEntry): Partial<MonsterStats> {
  const bonus: Partial<MonsterStats> = {};
  for (const [key, val] of Object.entries(entry.peakStats)) {
    const k = key as keyof MonsterStats;
    const b = Math.floor(val * 0.05);
    if (b > 0) bonus[k] = b;
  }
  return bonus;
}
