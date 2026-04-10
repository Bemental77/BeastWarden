import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMonster } from '../hooks/useMonster';
import { MonsterSprite } from '../components/MonsterSprite';
import { StatBar } from '../components/StatBar';
import { getSpecies } from '../constants/species';
import { MonsterStats } from '../types';

const STAT_COLORS: Record<keyof MonsterStats, string> = {
  life:         '#E53935',
  power:        '#C62828',
  defense:      '#2E7D32',
  speed:        '#1565C0',
  intelligence: '#6A1B9A',
  skill:        '#E65100',
};

const STAT_MAX = 999;

export function StatsScreen() {
  const { monster, loading } = useMonster();

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>LOADING...</Text>
      </View>
    );
  }

  if (!monster) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>NO BEAST ASSIGNED</Text>
        <Text style={styles.subEmpty}>Summon a beast from the Ranch.</Text>
      </View>
    );
  }

  const species = getSpecies(monster.species);
  const lifespanPct = (monster.age / monster.lifespan) * 100;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.spriteRow}>
        <MonsterSprite color={monster.spriteColor} stage={monster.lifecycleStage} name={monster.name} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{monster.name}</Text>
          <Text style={styles.species}>{species?.name ?? monster.species}</Text>
          <Text style={styles.stage}>{monster.lifecycleStage.toUpperCase()}</Text>
          {monster.wins > 0 && (
            <Text style={styles.wins}>{monster.wins} TOURNAMENT WIN{monster.wins !== 1 ? 'S' : ''}</Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>VITALS</Text>
      <StatBar label="Age" value={lifespanPct} max={100} color="#546E7A" />
      <View style={styles.ageRow}>
        <Text style={styles.ageDetail}>Day {monster.age.toFixed(2)}</Text>
        <Text style={styles.ageDetail}>Lifespan: {monster.lifespan} days</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>COMBAT STATS</Text>
      {(Object.entries(monster.stats) as [keyof MonsterStats, number][]).map(([key, val]) => (
        <StatBar
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={val}
          max={STAT_MAX}
          color={STAT_COLORS[key]}
        />
      ))}

      {monster.inheritedBonus && Object.keys(monster.inheritedBonus).length > 0 && (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>INHERITED BONUS</Text>
          {(Object.entries(monster.inheritedBonus) as [keyof MonsterStats, number][]).map(([key, val]) => (
            <Text key={key} style={styles.bonusStat}>
              +{val} {key}
            </Text>
          ))}
        </>
      )}

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>CONDITION</Text>
      <StatBar label="Hunger" value={monster.hunger} color="#EF6C00" />
      <StatBar label="Mood" value={monster.mood} color="#1976D2" />
      <StatBar label="Fatigue" value={monster.fatigue} color="#7B1FA2" />

      {monster.injuryUntil && Date.now() < monster.injuryUntil && (
        <Text style={styles.injuryNote}>
          INJURED — recovers in {Math.ceil((monster.injuryUntil - Date.now()) / 60000)} min
        </Text>
      )}

      {species && (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>SPECIES INFO</Text>
          <Text style={styles.speciesDesc}>{species.description}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 16, paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center' },
  empty: { color: '#546E7A', fontFamily: 'monospace', fontSize: 16, letterSpacing: 3 },
  subEmpty: { color: '#37474F', fontFamily: 'monospace', fontSize: 12, marginTop: 8 },
  spriteRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  headerInfo: { flex: 1 },
  name: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold' },
  species: { color: '#78909C', fontFamily: 'monospace', fontSize: 13, marginTop: 2 },
  stage: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginTop: 4 },
  wins: { color: '#FFB300', fontFamily: 'monospace', fontSize: 11, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#1E1E1E', marginVertical: 14 },
  sectionTitle: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, letterSpacing: 3, marginBottom: 10 },
  ageRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  ageDetail: { color: '#37474F', fontFamily: 'monospace', fontSize: 10 },
  bonusStat: { color: '#A5D6A7', fontFamily: 'monospace', fontSize: 12, marginBottom: 2 },
  injuryNote: { color: '#EF5350', fontFamily: 'monospace', fontSize: 12, marginTop: 8, letterSpacing: 1 },
  speciesDesc: { color: '#78909C', fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
});
