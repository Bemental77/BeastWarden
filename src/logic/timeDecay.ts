import { Monster } from '../types';
import { DECAY_RATES, DEATH_THRESHOLD_HOURS, getStageForAge } from '../constants/lifecycle';

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function applyTimeDecay(monster: Monster, now: number): Monster {
  if (monster.lifecycleStage === 'dead') return monster;
  if (monster.lifecycleStage === 'egg') {
    // Egg doesn't decay but does age
    const elapsedMs = now - monster.lastUpdated;
    const elapsedDays = elapsedMs / MS_PER_DAY;
    const newAge = monster.age + elapsedDays;
    const newStage = getStageForAge(newAge);
    return { ...monster, age: newAge, lifecycleStage: newStage, lastUpdated: now };
  }

  const elapsedMs = now - monster.lastUpdated;
  const elapsedHours = elapsedMs / MS_PER_HOUR;
  const elapsedDays = elapsedMs / MS_PER_DAY;

  let { hunger, mood, fatigue, starvingHours, depressedHours, age } = monster;
  let lifecycleStage: import('../types').LifecycleStage = monster.lifecycleStage;

  // Age
  age = age + elapsedDays;

  // Hunger decay
  hunger = Math.max(0, hunger - DECAY_RATES.hungerPerHour * elapsedHours);

  // Mood passive decay
  mood = Math.max(0, mood - DECAY_RATES.moodPerHour * elapsedHours);

  // Fatigue natural recovery (only when not in a training session — passive)
  fatigue = Math.max(0, fatigue - DECAY_RATES.fatigueRecoveryPerHour * elapsedHours);

  // Track critical-state accumulation
  starvingHours = hunger <= 0 ? starvingHours + elapsedHours : 0;
  depressedHours = mood <= 0 ? depressedHours + elapsedHours : 0;

  // Check lifespan death
  if (age >= monster.lifespan) {
    return { ...monster, age, lifecycleStage: 'dead', hunger, mood, fatigue, starvingHours, depressedHours, lastUpdated: now };
  }

  // Check neglect death
  if (starvingHours >= DEATH_THRESHOLD_HOURS || depressedHours >= DEATH_THRESHOLD_HOURS) {
    return { ...monster, age, lifecycleStage: 'dead', hunger, mood, fatigue, starvingHours, depressedHours, lastUpdated: now };
  }

  // Stage transition
  lifecycleStage = getStageForAge(age);

  return {
    ...monster,
    age,
    lifecycleStage,
    hunger,
    mood,
    fatigue,
    starvingHours,
    depressedHours,
    lastUpdated: now,
  };
}
