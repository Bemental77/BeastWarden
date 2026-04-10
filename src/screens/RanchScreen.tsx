import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useMonster } from '../hooks/useMonster';
import { MonsterSprite } from '../components/MonsterSprite';
import { StatBar } from '../components/StatBar';
import { ActionButton } from '../components/ActionButton';
import { feed, rest, play, train } from '../logic/careActions';
import { createMonster, toStableEntry, computeInheritedBonus } from '../logic/createMonster';
import { TRAINING_TYPES } from '../constants/training';
import { STAGE_TRAINING_UNLOCK } from '../constants/lifecycle';
import { getUnlockedSpecies } from '../constants/species';
import { addToStable } from '../storage/persistence';
import { Monster } from '../types';

export function RanchScreen() {
  const { monster, totalWins, loading, setMonster, retireMonster, sessionStart } = useMonster();
  const [feedback, setFeedback] = useState('');
  const [showNewMonster, setShowNewMonster] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('golem');
  const [useInheritance, setUseInheritance] = useState(false);
  const [deadEntry, setDeadEntry] = useState<ReturnType<typeof toStableEntry> | null>(null);

  const msg = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleFeed = () => {
    if (!monster) return;
    const result = feed(monster);
    if (result.ok) setMonster(result.monster);
    msg(result.message);
  };

  const handleRest = () => {
    if (!monster) return;
    const result = rest(monster);
    if (result.ok) setMonster(result.monster);
    msg(result.message);
  };

  const handlePlay = () => {
    if (!monster) return;
    const result = play(monster);
    if (result.ok) setMonster(result.monster);
    msg(result.message);
  };

  const handleTrain = (id: string) => {
    if (!monster) return;
    const result = train(monster, id, sessionStart);
    if (result.ok) setMonster(result.monster);
    msg(result.message);
  };

  const handleRetire = async () => {
    if (!monster) return;
    const entry = await retireMonster();
    setDeadEntry(entry);
    setShowNewMonster(true);
  };

  const handleCreateNew = () => {
    if (!newName.trim()) {
      msg('Enter a name.');
      return;
    }
    const bonus = useInheritance && deadEntry ? computeInheritedBonus(deadEntry) : undefined;
    const newM = createMonster(newName.trim(), selectedSpecies, bonus);
    setMonster(newM);
    setShowNewMonster(false);
    setNewName('');
    setDeadEntry(null);
    setUseInheritance(false);
    msg(`${newM.name} arrives at the ranch.`);
  };

  const unlockedSpecies = getUnlockedSpecies(totalWins);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.loadingText}>LOADING RANCH...</Text>
      </View>
    );
  }

  if (!monster) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.emptyTitle}>NO BEAST ASSIGNED</Text>
        <Text style={styles.emptySubtitle}>The ranch is quiet.</Text>
        <ActionButton
          label="SUMMON BEAST"
          onPress={() => setShowNewMonster(true)}
          color="#37474F"
          style={styles.summonBtn}
        />
        <NewMonsterModal
          visible={showNewMonster}
          onClose={() => setShowNewMonster(false)}
          onCreate={handleCreateNew}
          name={newName}
          setName={setNewName}
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
          unlockedSpecies={unlockedSpecies}
          showInheritance={!!deadEntry}
          useInheritance={useInheritance}
          setUseInheritance={setUseInheritance}
        />
      </View>
    );
  }

  const isDead = monster.lifecycleStage === 'dead';
  const isEgg = monster.lifecycleStage === 'egg';
  const isInjured = !!(monster.injuryUntil && Date.now() < monster.injuryUntil);

  const unlocked = STAGE_TRAINING_UNLOCK[monster.lifecycleStage];
  const alreadyTrained = (id: string) => (monster.trainCooldowns[id] ?? 0) >= sessionStart;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.monsterName}>{monster.name}</Text>
        <Text style={styles.speciesBadge}>
          {monster.species.toUpperCase()} · {monster.lifecycleStage.toUpperCase()}
        </Text>
        <Text style={styles.age}>Day {monster.age.toFixed(1)}</Text>
      </View>

      {/* Viewport */}
      <View style={styles.viewport}>
        <MonsterSprite color={monster.spriteColor} stage={monster.lifecycleStage} name={monster.name} />
        {isInjured && <Text style={styles.injuredBadge}>INJURED</Text>}
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </View>

      {/* Care bars */}
      {!isEgg && (
        <View style={styles.barsSection}>
          <StatBar label="Hunger" value={monster.hunger} color="#EF6C00" />
          <StatBar label="Mood" value={monster.mood} color="#1976D2" />
          <StatBar label="Fatigue" value={monster.fatigue} color="#7B1FA2" />
        </View>
      )}

      {isEgg && (
        <Text style={styles.eggNote}>Egg hatches soon... keep watch.</Text>
      )}

      {/* Actions */}
      {!isDead && !isEgg && (
        <>
          <Text style={styles.sectionTitle}>CARE</Text>
          <View style={styles.actionRow}>
            <ActionButton label="FEED" onPress={handleFeed} color="#E65100" disabled={monster.hunger >= 95} />
            <ActionButton label="REST" onPress={handleRest} color="#4A148C" disabled={monster.fatigue <= 5} />
            <ActionButton label="PLAY" onPress={handlePlay} color="#0D47A1" disabled={monster.mood >= 95} />
          </View>

          {unlocked.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>TRAINING</Text>
              <View style={styles.trainGrid}>
                {TRAINING_TYPES.filter((t) => unlocked.includes(t.id)).map((t) => {
                  const done = alreadyTrained(t.id);
                  return (
                    <ActionButton
                      key={t.id}
                      label={done ? `${t.id} ✓` : t.id.toUpperCase()}
                      onPress={() => handleTrain(t.id)}
                      color={t.color}
                      disabled={done || isInjured || monster.fatigue >= 90}
                      style={styles.trainBtn}
                    />
                  );
                })}
              </View>
            </>
          )}
        </>
      )}

      {isDead && (
        <View style={styles.deathSection}>
          <Text style={styles.deathText}>
            {monster.name} has passed after {monster.age.toFixed(1)} days.
          </Text>
          <ActionButton label="REFREEZE / COMBINE" onPress={handleRetire} color="#37474F" />
        </View>
      )}

      <NewMonsterModal
        visible={showNewMonster}
        onClose={() => setShowNewMonster(false)}
        onCreate={handleCreateNew}
        name={newName}
        setName={setNewName}
        selectedSpecies={selectedSpecies}
        setSelectedSpecies={setSelectedSpecies}
        unlockedSpecies={unlockedSpecies}
        showInheritance={!!deadEntry}
        useInheritance={useInheritance}
        setUseInheritance={setUseInheritance}
      />
    </ScrollView>
  );
}

interface NewMonsterModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: () => void;
  name: string;
  setName: (n: string) => void;
  selectedSpecies: string;
  setSelectedSpecies: (s: string) => void;
  unlockedSpecies: ReturnType<typeof getUnlockedSpecies>;
  showInheritance: boolean;
  useInheritance: boolean;
  setUseInheritance: (v: boolean) => void;
}

function NewMonsterModal({
  visible, onClose, onCreate, name, setName,
  selectedSpecies, setSelectedSpecies, unlockedSpecies,
  showInheritance, useInheritance, setUseInheritance,
}: NewMonsterModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modal.overlay}>
        <View style={modal.box}>
          <Text style={modal.title}>SUMMON BEAST</Text>

          <Text style={modal.label}>NAME</Text>
          <TextInput
            style={modal.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name..."
            placeholderTextColor="#546E7A"
            maxLength={20}
          />

          <Text style={modal.label}>SPECIES</Text>
          {unlockedSpecies.map((sp) => (
            <TouchableOpacity
              key={sp.id}
              style={[modal.speciesRow, selectedSpecies === sp.id && modal.speciesSelected]}
              onPress={() => setSelectedSpecies(sp.id)}
            >
              <View style={[modal.speciesSwatch, { backgroundColor: sp.spriteColor }]} />
              <View>
                <Text style={modal.speciesName}>{sp.name}</Text>
                <Text style={modal.speciesDesc}>{sp.description}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {showInheritance && (
            <TouchableOpacity
              style={modal.inheritRow}
              onPress={() => setUseInheritance(!useInheritance)}
            >
              <View style={[modal.checkbox, useInheritance && modal.checkboxOn]} />
              <Text style={modal.inheritLabel}>Inherit stats from previous beast (+5%)</Text>
            </TouchableOpacity>
          )}

          <View style={modal.btnRow}>
            <ActionButton label="CANCEL" onPress={onClose} color="#263238" />
            <ActionButton label="SUMMON" onPress={onCreate} color="#1B5E20" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 16, paddingBottom: 40 },
  center: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#546E7A', fontFamily: 'monospace', letterSpacing: 3 },
  emptyTitle: { color: '#546E7A', fontFamily: 'monospace', fontSize: 20, letterSpacing: 4 },
  emptySubtitle: { color: '#37474F', fontFamily: 'monospace', marginTop: 8, marginBottom: 32 },
  summonBtn: { marginTop: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  monsterName: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  speciesBadge: { color: '#78909C', fontFamily: 'monospace', fontSize: 12, marginTop: 2, letterSpacing: 1 },
  age: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, marginTop: 2 },
  viewport: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2D2F',
    padding: 32,
    marginBottom: 20,
    minHeight: 180,
  },
  injuredBadge: {
    color: '#EF5350',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 10,
  },
  feedback: {
    color: '#B0BEC5',
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  eggNote: {
    color: '#546E7A',
    fontFamily: 'monospace',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  barsSection: { marginBottom: 20 },
  sectionTitle: {
    color: '#546E7A',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 8,
    marginTop: 4,
  },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 16, justifyContent: 'center' },
  trainGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  trainBtn: { flex: 1, minWidth: 100 },
  deathSection: { alignItems: 'center', gap: 16, marginTop: 20 },
  deathText: { color: '#546E7A', fontFamily: 'monospace', textAlign: 'center', lineHeight: 20 },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263238',
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },
  title: {
    color: '#ECEFF1',
    fontFamily: 'monospace',
    fontSize: 16,
    letterSpacing: 3,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: { color: '#546E7A', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 6 },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#263238',
    borderRadius: 4,
    color: '#ECEFF1',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 10,
    marginBottom: 16,
  },
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginBottom: 6,
  },
  speciesSelected: { borderColor: '#37474F', backgroundColor: '#1A1A1A' },
  speciesSwatch: { width: 28, height: 28, borderRadius: 4 },
  speciesName: { color: '#ECEFF1', fontFamily: 'monospace', fontSize: 13 },
  speciesDesc: { color: '#546E7A', fontFamily: 'monospace', fontSize: 10, marginTop: 2 },
  inheritRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 12 },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#546E7A',
    borderRadius: 3,
  },
  checkboxOn: { backgroundColor: '#1B5E20', borderColor: '#1B5E20' },
  inheritLabel: { color: '#90A4AE', fontFamily: 'monospace', fontSize: 12 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});
