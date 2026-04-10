import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useMonster } from '../hooks/useMonster';
import { ActionButton } from '../components/ActionButton';
import { MonsterSprite } from '../components/MonsterSprite';
import { simulateBattle, applyBattleResult } from '../logic/battle';
import { TOURNAMENTS } from '../constants/tournaments';
import { BattleRound, Tournament, TournamentOpponent } from '../types';

type Phase = 'select' | 'fighting' | 'result';

export function BattleScreen() {
  const { monster, setMonster, loading } = useMonster();
  const [phase, setPhase] = useState<Phase>('select');
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [tournamentWon, setTournamentWon] = useState(false);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>LOADING...</Text>
      </View>
    );
  }

  if (!monster || monster.lifecycleStage === 'egg' || monster.lifecycleStage === 'dead') {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>NO COMBATANT</Text>
        <Text style={styles.subEmpty}>
          {monster?.lifecycleStage === 'egg'
            ? 'Your beast must hatch first.'
            : 'Assign a living beast from the Ranch.'}
        </Text>
      </View>
    );
  }

  const handleSelectTournament = (t: Tournament) => {
    setActiveTournament(t);
    setOpponentIndex(0);
    setLog([`=== ${t.name.toUpperCase()} ===`, `${monster.name} steps into the arena.`]);
    setPhase('fighting');
    setTournamentWon(false);
  };

  const handleFight = () => {
    if (!activeTournament || !monster) return;
    const opponent = activeTournament.opponents[opponentIndex];
    const result = simulateBattle(monster, opponent);

    const newLines: string[] = [
      `--- Round vs ${opponent.name} ---`,
      ...result.rounds.map((r) => formatRound(r, monster.name, opponent.name)),
      result.won
        ? `> ${monster.name} WINS against ${opponent.name}!`
        : `> ${monster.name} LOSES to ${opponent.name}...`,
    ];

    const updated = applyBattleResult(monster, result);
    setMonster(updated);
    setLog((prev) => [...prev, ...newLines]);

    if (!result.won) {
      setLog((prev) => [...prev, `Tournament over. Better luck next time.`]);
      setPhase('result');
      setTournamentWon(false);
      return;
    }

    const nextIndex = opponentIndex + 1;
    if (nextIndex >= activeTournament.opponents.length) {
      setLog((prev) => [...prev, `=== ${monster.name} WINS THE ${activeTournament.name.toUpperCase()}! ===`]);
      setPhase('result');
      setTournamentWon(true);
    } else {
      setOpponentIndex(nextIndex);
      const next = activeTournament.opponents[nextIndex];
      setLog((prev) => [...prev, `Next opponent: ${next.name} (${next.species})`]);
    }
  };

  const handleReset = () => {
    setPhase('select');
    setActiveTournament(null);
    setLog([]);
  };

  const currentOpponent = activeTournament?.opponents[opponentIndex];

  // Check stat requirements
  const canEnter = (t: Tournament): boolean => {
    if (!t.statRequirement) return true;
    return Object.entries(t.statRequirement).every(
      ([k, v]) => (monster.stats as any)[k] >= (v ?? 0)
    );
  };

  return (
    <View style={styles.screen}>
      {phase === 'select' && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>TOURNAMENT HALL</Text>
          <Text style={styles.subtitle}>Choose your trial, Warden.</Text>

          {TOURNAMENTS.map((t) => {
            const eligible = canEnter(t);
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.tournamentCard, !eligible && styles.tournamentLocked]}
                onPress={() => eligible && handleSelectTournament(t)}
                disabled={!eligible}
              >
                <View>
                  <Text style={styles.tournamentName}>{t.name}</Text>
                  <Text style={styles.tournamentTier}>TIER {t.tier}</Text>
                  <Text style={styles.tournamentOpponents}>
                    {t.opponents.map((o) => o.name).join(' · ')}
                  </Text>
                  {t.statRequirement && (
                    <Text style={[styles.reqText, !eligible && styles.reqFailed]}>
                      Requires:{' '}
                      {Object.entries(t.statRequirement)
                        .map(([k, v]) => `${k} ${v}+`)
                        .join(', ')}
                    </Text>
                  )}
                </View>
                {eligible && <Text style={styles.enterArrow}>›</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {(phase === 'fighting' || phase === 'result') && (
        <View style={styles.arenaContainer}>
          {/* Combatants */}
          {currentOpponent && phase === 'fighting' && (
            <View style={styles.combatants}>
              <View style={styles.combatantCell}>
                <MonsterSprite color={monster.spriteColor} stage={monster.lifecycleStage} name={monster.name} />
                <Text style={styles.combatantName}>{monster.name}</Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.combatantCell}>
                <MonsterSprite
                  color={currentOpponent.spriteColor}
                  stage="adult"
                  name={currentOpponent.name}
                />
                <Text style={styles.combatantName}>{currentOpponent.name}</Text>
              </View>
            </View>
          )}

          {/* Battle Log */}
          <ScrollView
            style={styles.logScroll}
            ref={(ref) => ref?.scrollToEnd({ animated: true })}
          >
            {log.map((line, i) => (
              <Text key={i} style={lineStyle(line)}>
                {line}
              </Text>
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.arenaActions}>
            {phase === 'fighting' && (
              <ActionButton
                label={`FIGHT ${currentOpponent?.name?.toUpperCase()}`}
                onPress={handleFight}
                color="#B71C1C"
                style={styles.fightBtn}
              />
            )}
            {phase === 'result' && (
              <ActionButton
                label="RETURN TO HALL"
                onPress={handleReset}
                color="#263238"
                style={styles.fightBtn}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function formatRound(round: BattleRound, playerName: string, opponentName: string): string {
  const who = round.attacker === 'player' ? playerName : opponentName;
  return `  ${who}: ${round.action} [-${round.damage}] | HP ${round.playerHP} / ${round.opponentHP}`;
}

function lineStyle(line: string) {
  if (line.startsWith('===')) return styles.logWin;
  if (line.startsWith('---')) return styles.logHeader;
  if (line.startsWith('>')) return styles.logResult;
  return styles.logLine;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  empty: { color: '#546E7A', fontFamily: 'monospace', fontSize: 16, letterSpacing: 3 },
  subEmpty: { color: '#37474F', fontFamily: 'monospace', fontSize: 12, marginTop: 8, textAlign: 'center', padding: 16 },
  pageTitle: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 18, letterSpacing: 4, marginBottom: 4 },
  subtitle: { color: '#546E7A', fontFamily: 'monospace', fontSize: 12, marginBottom: 20 },
  tournamentCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1E2D2F',
    borderRadius: 6,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tournamentLocked: { opacity: 0.4 },
  tournamentName: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold' },
  tournamentTier: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginTop: 2 },
  tournamentOpponents: { color: '#78909C', fontFamily: 'monospace', fontSize: 11, marginTop: 4 },
  reqText: { color: '#546E7A', fontFamily: 'monospace', fontSize: 10, marginTop: 4 },
  reqFailed: { color: '#B71C1C' },
  enterArrow: { color: '#546E7A', fontSize: 24 },
  arenaContainer: { flex: 1 },
  combatants: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  combatantCell: { alignItems: 'center', gap: 6 },
  combatantName: { color: '#B0BEC5', fontFamily: 'monospace', fontSize: 11 },
  vsText: { color: '#37474F', fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold' },
  logScroll: { flex: 1, padding: 12, backgroundColor: '#070707' },
  logLine: { color: '#78909C', fontFamily: 'monospace', fontSize: 11, lineHeight: 18 },
  logHeader: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, lineHeight: 20, marginTop: 6 },
  logResult: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 12, lineHeight: 20, marginTop: 4 },
  logWin: { color: '#FFB300', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold', lineHeight: 24, textAlign: 'center' },
  arenaActions: { padding: 12, backgroundColor: '#0D0D0D', borderTopWidth: 1, borderTopColor: '#1E1E1E' },
  fightBtn: { width: '100%' },
});
