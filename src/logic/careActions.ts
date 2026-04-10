import { Monster } from '../types';
import { TRAINING_TYPES, TrainingType } from '../constants/training';
import { STAGE_TRAINING_UNLOCK } from '../constants/lifecycle';

export type ActionResult =
  | { ok: true; monster: Monster; message: string }
  | { ok: false; message: string };

export function feed(monster: Monster): ActionResult {
  if (monster.lifecycleStage === 'egg' || monster.lifecycleStage === 'dead') {
    return { ok: false, message: 'Cannot feed right now.' };
  }
  if (monster.hunger >= 95) {
    return { ok: false, message: `${monster.name} is already full.` };
  }

  const updated: Monster = {
    ...monster,
    hunger: Math.min(100, monster.hunger + 40),
    mood: Math.min(100, monster.mood + 5),
    fatigue: Math.min(100, monster.fatigue + 2),
    starvingHours: 0,
  };
  return { ok: true, monster: updated, message: `${monster.name} ate heartily.` };
}

export function rest(monster: Monster): ActionResult {
  if (monster.lifecycleStage === 'egg' || monster.lifecycleStage === 'dead') {
    return { ok: false, message: 'Cannot rest right now.' };
  }
  if (monster.fatigue <= 5) {
    return { ok: false, message: `${monster.name} is already well-rested.` };
  }

  const updated: Monster = {
    ...monster,
    fatigue: Math.max(0, monster.fatigue - 35),
    mood: Math.min(100, monster.mood + 3),
  };
  return { ok: true, monster: updated, message: `${monster.name} rested and recovered.` };
}

export function play(monster: Monster): ActionResult {
  if (monster.lifecycleStage === 'egg' || monster.lifecycleStage === 'dead') {
    return { ok: false, message: 'Cannot play right now.' };
  }
  if (monster.mood >= 95) {
    return { ok: false, message: `${monster.name} is already in great spirits.` };
  }

  const updated: Monster = {
    ...monster,
    mood: Math.min(100, monster.mood + 25),
    fatigue: Math.min(100, monster.fatigue + 8),
    hunger: Math.max(0, monster.hunger - 5),
    depressedHours: 0,
  };
  return { ok: true, monster: updated, message: `${monster.name} played and feels great!` };
}

export function train(monster: Monster, trainingId: string, sessionStart: number): ActionResult {
  if (monster.lifecycleStage === 'egg' || monster.lifecycleStage === 'dead') {
    return { ok: false, message: 'Cannot train right now.' };
  }

  const unlocked = STAGE_TRAINING_UNLOCK[monster.lifecycleStage];
  if (!unlocked.includes(trainingId)) {
    return { ok: false, message: `${monster.name} cannot do that training yet.` };
  }

  // Session cooldown: only once per session per type
  const lastUsed = monster.trainCooldowns[trainingId] ?? 0;
  if (lastUsed >= sessionStart) {
    return { ok: false, message: `Already trained ${trainingId} this session.` };
  }

  // Injury check
  if (monster.injuryUntil && Date.now() < monster.injuryUntil) {
    return { ok: false, message: `${monster.name} is injured and needs rest.` };
  }

  const training = TRAINING_TYPES.find((t) => t.id === trainingId);
  if (!training) return { ok: false, message: 'Unknown training type.' };

  if (monster.fatigue >= 90) {
    return { ok: false, message: `${monster.name} is too exhausted to train.` };
  }

  let newStats = { ...monster.stats };
  newStats[training.statTarget] = Math.min(999, newStats[training.statTarget] + training.statGain);

  const newFatigue = Math.min(100, monster.fatigue + training.fatigueCost);
  const newHunger = Math.max(0, monster.hunger - 8);

  // Injury roll
  let injuryUntil = monster.injuryUntil;
  let message = `${monster.name} trained ${training.label}. ${training.statTarget} +${training.statGain}.`;
  if (monster.fatigue >= training.injuryThreshold && Math.random() < training.injuryChance) {
    injuryUntil = Date.now() + training.injuryDurationMs;
    message += ' Got injured!';
  }

  const updated: Monster = {
    ...monster,
    stats: newStats,
    fatigue: newFatigue,
    hunger: newHunger,
    injuryUntil,
    trainCooldowns: { ...monster.trainCooldowns, [trainingId]: Date.now() },
  };

  return { ok: true, monster: updated, message };
}
