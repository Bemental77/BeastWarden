export interface TrainingType {
  id: string;
  label: string;
  statTarget: 'power' | 'speed' | 'intelligence' | 'defense';
  statGain: number;
  fatigueCost: number;
  /** If fatigue >= this threshold, there's an injury chance */
  injuryThreshold: number;
  /** Probability (0–1) of injury when above threshold */
  injuryChance: number;
  /** How long the injury lasts in ms */
  injuryDurationMs: number;
  /** Session cooldown in ms (once per session per type) */
  cooldownMs: number;
  color: string;
}

export const TRAINING_TYPES: TrainingType[] = [
  {
    id: 'Power',
    label: 'Power Drill',
    statTarget: 'power',
    statGain: 3,
    fatigueCost: 20,
    injuryThreshold: 70,
    injuryChance: 0.25,
    injuryDurationMs: 60 * 60 * 1000, // 1 hour
    cooldownMs: 0, // once per app session (tracked separately)
    color: '#C62828',
  },
  {
    id: 'Speed',
    label: 'Sprint Training',
    statTarget: 'speed',
    statGain: 3,
    fatigueCost: 15,
    injuryThreshold: 75,
    injuryChance: 0.2,
    injuryDurationMs: 45 * 60 * 1000, // 45 min
    cooldownMs: 0,
    color: '#1565C0',
  },
  {
    id: 'Intelligence',
    label: 'Mind Trial',
    statTarget: 'intelligence',
    statGain: 3,
    fatigueCost: 10,
    injuryThreshold: 80,
    injuryChance: 0.1,
    injuryDurationMs: 30 * 60 * 1000,
    cooldownMs: 0,
    color: '#6A1B9A',
  },
  {
    id: 'Defense',
    label: 'Endurance Test',
    statTarget: 'defense',
    statGain: 3,
    fatigueCost: 18,
    injuryThreshold: 65,
    injuryChance: 0.2,
    injuryDurationMs: 90 * 60 * 1000, // 1.5 hours
    cooldownMs: 0,
    color: '#2E7D32',
  },
];

export const SESSION_COOLDOWN_MS = 0; // Cooldowns are per session (reset on app open)
