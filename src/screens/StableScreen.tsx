import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { loadStable } from '../storage/persistence';
import { StableEntry, MonsterStats } from '../types';
import { getSpecies } from '../constants/species';

export function StableScreen() {
  const [stable, setStable] = useState<StableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StableEntry | null>(null);

  useEffect(() => {
    loadStable().then((entries) => {
      setStable(entries);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>LOADING...</Text>
      </View>
    );
  }

  if (stable.length === 0) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.empty}>STABLE IS EMPTY</Text>
        <Text style={styles.subEmpty}>Beasts that have passed will be recorded here.</Text>
      </View>
    );
  }

  if (selected) {
    return <EntryDetail entry={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>THE STABLE</Text>
      <Text style={styles.subtitle}>{stable.length} beast{stable.length !== 1 ? 's' : ''} recorded</Text>
      <FlatList
        data={stable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
            <View style={[styles.swatch, { backgroundColor: getSpecies(item.species)?.spriteColor ?? '#37474F' }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardSpecies}>{getSpecies(item.species)?.name ?? item.species}</Text>
              <Text style={styles.cardAge}>
                {item.ageAtDeath.toFixed(1)} days · {item.wins} win{item.wins !== 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function EntryDetail({ entry, onBack }: { entry: StableEntry; onBack: () => void }) {
  const species = getSpecies(entry.species);
  const diedDate = new Date(entry.diedAt).toLocaleDateString();

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backRow} onPress={onBack}>
        <Text style={styles.backText}>‹ BACK</Text>
      </TouchableOpacity>

      <View style={styles.detailHeader}>
        <View style={[styles.detailSwatch, { backgroundColor: species?.spriteColor ?? '#37474F' }]} />
        <View>
          <Text style={styles.detailName}>{entry.name}</Text>
          <Text style={styles.detailSpecies}>{species?.name ?? entry.species}</Text>
          <Text style={styles.detailMeta}>
            Passed on {diedDate} · Age {entry.ageAtDeath.toFixed(1)} days
          </Text>
          {entry.wins > 0 && (
            <Text style={styles.detailWins}>{entry.wins} TOURNAMENT WIN{entry.wins !== 1 ? 'S' : ''}</Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>PEAK STATS</Text>

      {(Object.entries(entry.peakStats) as [keyof MonsterStats, number][]).map(([key, val]) => (
        <View key={key} style={styles.statRow}>
          <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <Text style={styles.statValue}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A', padding: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },
  empty: { color: '#546E7A', fontFamily: 'monospace', fontSize: 16, letterSpacing: 3 },
  subEmpty: { color: '#37474F', fontFamily: 'monospace', fontSize: 12, marginTop: 8, textAlign: 'center' },
  pageTitle: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 18, letterSpacing: 4, marginBottom: 4 },
  subtitle: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, marginBottom: 16 },
  list: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  swatch: { width: 40, height: 40, borderRadius: 6, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 14 },
  cardSpecies: { color: '#78909C', fontFamily: 'monospace', fontSize: 11, marginTop: 2 },
  cardAge: { color: '#546E7A', fontFamily: 'monospace', fontSize: 10, marginTop: 2 },
  cardArrow: { color: '#37474F', fontSize: 22 },
  backRow: { marginBottom: 16 },
  backText: { color: '#546E7A', fontFamily: 'monospace', fontSize: 13 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  detailSwatch: { width: 60, height: 60, borderRadius: 10 },
  detailName: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold' },
  detailSpecies: { color: '#78909C', fontFamily: 'monospace', fontSize: 13, marginTop: 2 },
  detailMeta: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, marginTop: 4 },
  detailWins: { color: '#FFB300', fontFamily: 'monospace', fontSize: 11, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#1E1E1E', marginVertical: 14 },
  sectionTitle: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, letterSpacing: 3, marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#111' },
  statLabel: { color: '#90A4AE', fontFamily: 'monospace', fontSize: 13 },
  statValue: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' },
});
