import { LifecycleStage } from '../types';

/** Age thresholds in real days for each stage transition */
export const STAGE_THRESHOLDS: Record<LifecycleStage, number> = {
  egg:   0,
  baby:  0.000116, // ~10 seconds
  youth: 1,
  adult: 3,
  elder: 7,
  dead:  Infinity,
};

export const STAGE_ORDER: LifecycleStage[] = ['egg', 'baby', 'youth', 'adult', 'elder', 'dead'];

/** Hours the monster must be at 0 hunger/mood before death */
export const DEATH_THRESHOLD_HOURS = 4;

/** Per-hour decay/recovery rates */
export const DECAY_RATES = {
  /** Hunger drops this many points per hour */
  hungerPerHour: 5,
  /** Mood drops this many points per hour (passive decay) */
  moodPerHour: 2,
  /** Fatigue naturally recovers this many points per hour when not training */
  fatigueRecoveryPerHour: 3,
};

/** Stage-specific training unlocks */
export const STAGE_TRAINING_UNLOCK: Record<LifecycleStage, string[]> = {
  egg:   [],
  baby:  ['Power'],
  youth: ['Power', 'Speed'],
  adult: ['Power', 'Speed', 'Intelligence', 'Defense'],
  elder: ['Power', 'Speed', 'Intelligence', 'Defense'],
  dead:  [],
};

export function getStageForAge(ageDays: number): LifecycleStage {
  if (ageDays < STAGE_THRESHOLDS.baby) return 'egg';
  if (ageDays < STAGE_THRESHOLDS.youth) return 'baby';
  if (ageDays < STAGE_THRESHOLDS.adult) return 'youth';
  if (ageDays < STAGE_THRESHOLDS.elder) return 'adult';
  return 'elder';
}
