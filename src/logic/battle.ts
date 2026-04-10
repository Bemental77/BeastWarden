import { Monster, TournamentOpponent, BattleRound, BattleResult } from '../types';
import { MonsterStats } from '../types';

function calcAttackPower(attacker: MonsterStats, defender: MonsterStats): number {
  // Base damage from power & skill, reduced by defender's defense
  const raw = (attacker.power * 0.6 + attacker.skill * 0.4) * (1 + Math.random() * 0.3 - 0.15);
  const mitigation = defender.defense * 0.4;
  return Math.max(1, Math.round(raw - mitigation));
}

function calcMaxHP(stats: MonsterStats): number {
  return stats.life + 50;
}

/** Returns true if attacker goes first based on speed + random factor */
function playerGoesFirst(player: MonsterStats, opponent: MonsterStats): boolean {
  const pSpeed = player.speed + Math.random() * 20;
  const oSpeed = opponent.speed + Math.random() * 20;
  return pSpeed >= oSpeed;
}

export function simulateBattle(player: Monster, opponent: TournamentOpponent): BattleResult {
  const rounds: BattleRound[] = [];

  let playerHP = calcMaxHP(player.stats);
  let opponentHP = calcMaxHP(opponent.stats);

  const MAX_ROUNDS = 20;
  let roundCount = 0;

  while (playerHP > 0 && opponentHP > 0 && roundCount < MAX_ROUNDS) {
    roundCount++;
    const playerFirst = playerGoesFirst(player.stats, opponent.stats);

    if (playerFirst) {
      // Player attacks
      const dmg = calcAttackPower(player.stats, opponent.stats);
      opponentHP = Math.max(0, opponentHP - dmg);
      rounds.push({
        attacker: 'player',
        action: `${player.name} strikes!`,
        damage: dmg,
        playerHP,
        opponentHP,
      });
      if (opponentHP <= 0) break;

      // Opponent attacks
      const oDmg = calcAttackPower(opponent.stats, player.stats);
      playerHP = Math.max(0, playerHP - oDmg);
      rounds.push({
        attacker: 'opponent',
        action: `${opponent.name} retaliates!`,
        damage: oDmg,
        playerHP,
        opponentHP,
      });
    } else {
      // Opponent attacks first
      const oDmg = calcAttackPower(opponent.stats, player.stats);
      playerHP = Math.max(0, playerHP - oDmg);
      rounds.push({
        attacker: 'opponent',
        action: `${opponent.name} strikes first!`,
        damage: oDmg,
        playerHP,
        opponentHP,
      });
      if (playerHP <= 0) break;

      const dmg = calcAttackPower(player.stats, opponent.stats);
      opponentHP = Math.max(0, opponentHP - dmg);
      rounds.push({
        attacker: 'player',
        action: `${player.name} counters!`,
        damage: dmg,
        playerHP,
        opponentHP,
      });
    }
  }

  const won = opponentHP <= 0 && playerHP > 0;
  const moodDelta = won ? 15 : -10;
  const xpGained: Partial<MonsterStats> = won
    ? { power: 1, speed: 1, defense: 1 }
    : { defense: 1 };

  // If round limit hit, whoever has more HP wins
  const tiebreakerWon = playerHP >= opponentHP;

  return {
    won: opponentHP <= 0 ? won : tiebreakerWon,
    rounds,
    moodDelta,
    xpGained,
  };
}

export function applyBattleResult(monster: Monster, result: BattleResult): Monster {
  const newStats = { ...monster.stats };
  for (const [key, val] of Object.entries(result.xpGained)) {
    const k = key as keyof MonsterStats;
    newStats[k] = Math.min(999, newStats[k] + (val ?? 0));
  }

  return {
    ...monster,
    stats: newStats,
    mood: Math.min(100, Math.max(0, monster.mood + result.moodDelta)),
    wins: result.won ? monster.wins + 1 : monster.wins,
  };
}
