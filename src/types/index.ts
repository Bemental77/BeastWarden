export type LifecycleStage = 'egg' | 'baby' | 'youth' | 'adult' | 'elder' | 'dead';

export interface MonsterStats {
  life: number;
  power: number;
  defense: number;
  speed: number;
  intelligence: number;
  skill: number;
}

export interface Monster {
  id: string;
  name: string;
  species: string;
  /** Hex color used as sprite placeholder */
  spriteColor: string;
  /** Age in real days */
  age: number;
  /** Max lifespan in real days */
  lifespan: number;
  lifecycleStage: LifecycleStage;
  stats: MonsterStats;
  /** 0–100 */
  mood: number;
  /** 0–100  (100 = full, 0 = starving) */
  hunger: number;
  /** 0–100  (100 = exhausted, 0 = fresh) */
  fatigue: number;
  /** Unix ms timestamp of last update tick */
  lastUpdated: number;
  /** training type -> last-used timestamp (ms) */
  trainCooldowns: Record<string, number>;
  /** ms timestamp until injury expires, or undefined */
  injuryUntil?: number;
  /** accumulated hours at 0 hunger (for death check) */
  starvingHours: number;
  /** accumulated hours at 0 mood (for death check) */
  depressedHours: number;
  /** how many tournaments won */
  wins: number;
  /** inherited bonus stats from previous monster */
  inheritedBonus?: Partial<MonsterStats>;
}

export interface StableEntry {
  id: string;
  name: string;
  species: string;
  ageAtDeath: number;
  peakStats: MonsterStats;
  stats: MonsterStats;
  diedAt: number;
  wins: number;
}

export interface BattleRound {
  attacker: 'player' | 'opponent';
  action: string;
  damage: number;
  playerHP: number;
  opponentHP: number;
}

export interface BattleResult {
  won: boolean;
  rounds: BattleRound[];
  moodDelta: number;
  xpGained: Partial<MonsterStats>;
}

export interface TournamentOpponent {
  name: string;
  species: string;
  spriteColor: string;
  stats: MonsterStats;
}

export interface Tournament {
  id: string;
  name: string;
  tier: number;
  opponents: TournamentOpponent[];
  statRequirement?: Partial<MonsterStats>;
}
