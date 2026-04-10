import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useMonster } from '../hooks/useMonster';
import { MonsterSprite } from '../components/MonsterSprite';
import { AlchemyVial } from '../components/AlchemyVial';
import { MedievalButton } from '../components/MedievalButton';
import { MedievalContainer } from '../components/MedievalContainer';
import { MedievalText } from '../components/MedievalText';
import { feed, rest, play, train } from '../logic/careActions';
import { createMonster, toStableEntry, computeInheritedBonus } from '../logic/createMonster';
import { TRAINING_TYPES } from '../constants/training';
import { STAGE_TRAINING_UNLOCK } from '../constants/lifecycle';
import { getUnlockedSpecies } from '../constants/species';
import { Monster } from '../types';
import { 
  medievalColors, 
  medievalSpacing, 
  medievalTypography,
  medievalShadows 
} from '../theme/medievalTheme';

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
        <MedievalText variant="h2" color={medievalColors.parchment}>
          LOADING RANCH...
        </MedievalText>
      </View>
    );
  }

  if (!monster) {
    return (
      <View style={[styles.screen, styles.center]}>
        <MedievalText variant="h2" color={medievalColors.parchment}>
          NO BEAST ASSIGNED
        </MedievalText>
        <MedievalText 
          variant="body" 
          color={medievalColors.tarnishedSilver}
          style={styles.emptySubtitle}
        >
          The ranch is quiet.
        </MedievalText>
        <MedievalButton
          label="SUMMON BEAST"
          onPress={() => setShowNewMonster(true)}
          variant="primary"
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
    <>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <MedievalContainer variant="iron" borderType="ornate">
          <MedievalText variant="h1" color={medievalColors.parchment}>
            {monster.name}
          </MedievalText>
          <MedievalText 
            variant="caption" 
            color={medievalColors.burnishedGold}
            style={styles.badge}
          >
            {monster.species.toUpperCase()} · {monster.lifecycleStage.toUpperCase()}
          </MedievalText>
          <MedievalText 
            variant="tiny" 
            color={medievalColors.tarnishedSilver}
            style={styles.ageText}
          >
            Day {monster.age.toFixed(1)}
          </MedievalText>
        </MedievalContainer>

        {/* Viewport */}
        <MedievalContainer variant="oak" borderType="simple" style={styles.viewport}>
          <MonsterSprite color={monster.spriteColor} stage={monster.lifecycleStage} name={monster.name} />
          {isInjured && (
            <MedievalText variant="tiny" color={medievalColors.bloodRed} style={styles.injuredBadge}>
              ⚠ INJURED
            </MedievalText>
          )}
          {feedback ? (
            <MedievalText variant="caption" color={medievalColors.burnishedGold} style={styles.feedback}>
              {feedback}
            </MedievalText>
          ) : null}
        </MedievalContainer>

        {/* Care Vitals */}
        {!isEgg && (
          <MedievalContainer variant="oak" borderType="simple" style={styles.vitalSection}>
            <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
              ◆ VITALS
            </MedievalText>
            <AlchemyVial label="Hunger" value={monster.hunger} max={100} color={medievalColors.warning} height={100} />
            <AlchemyVial label="Mood" value={monster.mood} max={100} color={medievalColors.vialBlue} height={100} />
            <AlchemyVial label="Fatigue" value={monster.fatigue} max={100} color="#7B1FA2" height={100} />
          </MedievalContainer>
        )}

        {isEgg && (
          <MedievalText 
            variant="body" 
            color={medievalColors.tarnishedSilver} 
            style={styles.eggNote}
          >
            ✦ Egg hatches soon... keep watch.
          </MedievalText>
        )}

        {/* Actions */}
        {!isDead && !isEgg && (
          <>
            <MedievalContainer variant="oak" borderType="simple">
              <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
                ◆ CARE
              </MedievalText>
              <View style={styles.actionRow}>
                <MedievalButton 
                  label="FEED" 
                  onPress={handleFeed} 
                  variant="primary"
                  disabled={monster.hunger >= 95} 
                />
                <MedievalButton 
                  label="REST" 
                  onPress={handleRest} 
                  variant="secondary"
                  disabled={monster.fatigue <= 5} 
                />
                <MedievalButton 
                  label="PLAY" 
                  onPress={handlePlay} 
                  variant="primary"
                  disabled={monster.mood >= 95} 
                />
              </View>
            </MedievalContainer>

            {unlocked.length > 0 && (
              <MedievalContainer variant="oak" borderType="simple">
                <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
                  ◆ TRAINING
                </MedievalText>
                <View style={styles.trainGrid}>
                  {TRAINING_TYPES.filter((t) => unlocked.includes(t.id)).map((t) => {
                    const done = alreadyTrained(t.id);
                    return (
                      <MedievalButton
                        key={t.id}
                        label={done ? `${t.id} ✓` : t.id.toUpperCase()}
                        onPress={() => handleTrain(t.id)}
                        variant="primary"
                        disabled={done || isInjured || monster.fatigue >= 90}
                        style={styles.trainBtn}
                      />
                    );
                  })}
                </View>
              </MedievalContainer>
            )}
          </>
        )}

        {isDead && (
          <MedievalContainer variant="iron" borderType="ornate">
            <MedievalText 
              variant="body" 
              color={medievalColors.bloodRed} 
              style={styles.deathText}
            >
              {monster.name} has passed after {monster.age.toFixed(1)} days.
            </MedievalText>
            <MedievalButton 
              label="COMMIT TO LEGACY" 
              onPress={handleRetire} 
              variant="danger"
              style={styles.deathBtn}
            />
          </MedievalContainer>
        )}
      </ScrollView>
      </View>
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
    </>
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
        <MedievalContainer variant="parchment" borderType="ornate" style={modal.box}>
          <MedievalText variant="h2" color={medievalColors.royalBurgundy} style={modal.title}>
            SUMMON BEAST
          </MedievalText>

          <MedievalText variant="tiny" color={medievalColors.iron} style={modal.label}>
            NAME
          </MedievalText>
          <TextInput
            style={modal.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name..."
            placeholderTextColor={medievalColors.tarnishedSilver}
            maxLength={20}
          />

          <MedievalText variant="tiny" color={medievalColors.iron} style={modal.label}>
            SPECIES
          </MedievalText>
          {unlockedSpecies.map((sp) => (
            <TouchableOpacity
              key={sp.id}
              style={[modal.speciesRow, selectedSpecies === sp.id && modal.speciesSelected]}
              onPress={() => setSelectedSpecies(sp.id)}
            >
              <View style={[modal.speciesSwatch, { backgroundColor: sp.spriteColor }]} />
              <View>
                <MedievalText variant="body" color={medievalColors.iron}>
                  {sp.name}
                </MedievalText>
                <MedievalText 
                  variant="caption" 
                  color={medievalColors.tarnishedSilver}
                  style={modal.speciesDesc}
                >
                  {sp.description}
                </MedievalText>
              </View>
            </TouchableOpacity>
          ))}

          {showInheritance && (
            <TouchableOpacity
              style={modal.inheritRow}
              onPress={() => setUseInheritance(!useInheritance)}
            >
              <View style={[modal.checkbox, useInheritance && modal.checkboxOn]} />
              <MedievalText variant="tiny" color={medievalColors.iron}>
                Inherit stats from previous beast (+5%)
              </MedievalText>
            </TouchableOpacity>
          )}

          <View style={modal.btnRow}>
            <MedievalButton label="CANCEL" onPress={onClose} variant="secondary" />
            <MedievalButton label="SUMMON" onPress={onCreate} variant="primary" />
          </View>
        </MedievalContainer>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: medievalColors.iron 
  },
  content: { 
    padding: medievalSpacing.md, 
    paddingBottom: medievalSpacing.xl,
    gap: medievalSpacing.md,
  },
  center: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  summonBtn: { 
    marginTop: medievalSpacing.lg,
    alignSelf: 'center',
  },
  badge: { 
    marginTop: medievalSpacing.xs 
  },
  ageText: { 
    marginTop: medievalSpacing.xs 
  },
  viewport: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuredBadge: {
    marginTop: medievalSpacing.md,
  },
  feedback: {
    marginTop: medievalSpacing.md,
    textAlign: 'center',
  },
  vitalSection: {
    marginVertical: medievalSpacing.md,
  },
  eggNote: {
    textAlign: 'center',
    marginVertical: medievalSpacing.lg,
  },
  sectionTitle: {
    marginBottom: medievalSpacing.md,
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: medievalSpacing.md, 
    justifyContent: 'center',
    marginBottom: medievalSpacing.md,
  },
  trainGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: medievalSpacing.md, 
    marginBottom: medievalSpacing.md 
  },
  trainBtn: { 
    flex: 1, 
    minWidth: 100 
  },
  emptySubtitle: {
    marginTop: medievalSpacing.sm,
    marginBottom: medievalSpacing.lg,
  },
  deathText: { 
    textAlign: 'center', 
    lineHeight: 24,
    marginBottom: medievalSpacing.md,
  },
  deathBtn: {
    alignSelf: 'center',
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: medievalSpacing.md,
  },
  box: {
    width: '100%',
    maxWidth: 420,
    padding: medievalSpacing.lg,
  },
  title: {
    marginBottom: medievalSpacing.lg,
    textAlign: 'center',
  },
  label: { 
    marginBottom: medievalSpacing.xs,
  },
  input: {
    backgroundColor: medievalColors.parchment,
    borderWidth: 1,
    borderColor: medievalColors.tarnishedSilver,
    borderRadius: 4,
    color: medievalColors.iron,
    fontFamily: medievalTypography.monoFamily,
    fontSize: 14,
    padding: medievalSpacing.md,
    marginBottom: medievalSpacing.md,
  },
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: medievalSpacing.md,
    padding: medievalSpacing.md,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: medievalColors.tarnishedSilver,
    marginBottom: medievalSpacing.sm,
    backgroundColor: 'rgba(242, 227, 198, 0.1)',
  },
  speciesSelected: { 
    borderColor: medievalColors.burnishedGold, 
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  speciesSwatch: { 
    width: 32, 
    height: 32, 
    borderRadius: 4,
    ...medievalShadows.light,
  },
  speciesDesc: { 
    marginTop: medievalSpacing.xs,
  },
  inheritRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: medievalSpacing.md, 
    marginVertical: medievalSpacing.md,
    paddingHorizontal: medievalSpacing.md,
    paddingVertical: medievalSpacing.sm,
    borderRadius: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: medievalColors.iron,
    borderRadius: 3,
  },
  checkboxOn: { 
    backgroundColor: medievalColors.alchemyGreen, 
    borderColor: medievalColors.alchemyGreen,
  },
  btnRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: medievalSpacing.lg,
    gap: medievalSpacing.md,
  },
});
