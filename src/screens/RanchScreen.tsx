import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation<any>();
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
  const monsterMove = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(monsterMove, {
          toValue: { x: 18, y: -16 },
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(monsterMove, {
          toValue: { x: -14, y: 20 },
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(monsterMove, {
          toValue: { x: 8, y: -8 },
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(monsterMove, {
          toValue: { x: 0, y: 0 },
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [monsterMove]);

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
  const weekLabel = `W${Math.max(1, Math.floor(monster.age / 7) + 1)}`;
  const monthLabel = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
  const goldTotal = 900 + totalWins * 120;
  const loyaltyLabel = Math.max(1, Math.floor(monster.mood / 20)).toString();
  const styleLabel = monster.mood >= 60 ? 'EVEN' : monster.mood >= 35 ? 'STEADY' : 'WEARY';
  const activeTraining = TRAINING_TYPES.find((t) => unlocked.includes(t.id));
  const trainingAction = () => {
    if (!activeTraining) {
      msg('Training not unlocked yet.');
      return;
    }
    handleTrain(activeTraining.id);
  };

  const monsterMoveStyle = {
    transform: monsterMove.getTranslateTransform(),
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <MedievalContainer variant="iron" borderType="ornate" style={styles.miniCard}>
          <MedievalText variant="tiny" color={medievalColors.burnishedGold} style={styles.summaryLabel}>
            DAY
          </MedievalText>
          <MedievalText variant="h3" color={medievalColors.parchment}>
            {monster.age.toFixed(1)}
          </MedievalText>
        </MedievalContainer>
        <MedievalContainer variant="iron" borderType="ornate" style={styles.miniCard}>
          <MedievalText variant="tiny" color={medievalColors.burnishedGold} style={styles.summaryLabel}>
            STYLE
          </MedievalText>
          <MedievalText variant="h3" color={medievalColors.parchment}>
            {styleLabel}
          </MedievalText>
        </MedievalContainer>
        <MedievalContainer variant="iron" borderType="ornate" style={styles.miniCard}>
          <MedievalText variant="tiny" color={medievalColors.burnishedGold} style={styles.summaryLabel}>
            GOLD
          </MedievalText>
          <MedievalText variant="h3" color={medievalColors.parchment}>
            {goldTotal} G
          </MedievalText>
        </MedievalContainer>
      </View>

      <View style={styles.mainArea}>
        <View style={styles.sidePanel}>
          <MedievalContainer variant="oak" borderType="simple" style={styles.sidePanelCard}>
            <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
              ACTIONS
            </MedievalText>
            <MedievalButton
              label="FEED"
              onPress={handleFeed}
              variant="primary"
              disabled={monster.hunger >= 95}
              style={styles.sideBtn}
            />
            <MedievalButton
              label="REST"
              onPress={handleRest}
              variant="secondary"
              disabled={monster.fatigue <= 5}
              style={styles.sideBtn}
            />
            <MedievalButton
              label="PLAY"
              onPress={handlePlay}
              variant="primary"
              disabled={monster.mood >= 95}
              style={styles.sideBtn}
            />
          </MedievalContainer>
        </View>

        <View style={styles.centerPanel}>
          <View style={styles.stageArea}>
            <Animated.View style={[styles.monsterMover, monsterMoveStyle]}>
              <MonsterSprite color={monster.spriteColor} stage={monster.lifecycleStage} name={monster.name} />
            </Animated.View>
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
          </View>

          <View style={styles.vitalRow}>
            <AlchemyVial label="Hunger" value={monster.hunger} max={100} color={medievalColors.warning} height={68} />
            <AlchemyVial label="Mood" value={monster.mood} max={100} color={medievalColors.vialBlue} height={68} />
            <AlchemyVial label="Fatigue" value={monster.fatigue} max={100} color="#7B1FA2" height={68} />
          </View>
        </View>

        <View style={styles.sidePanel}>
          <MedievalContainer variant="oak" borderType="simple" style={styles.sidePanelCard}>
            <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
              TRAINING
            </MedievalText>
            <MedievalButton
              label={activeTraining ? activeTraining.id.toUpperCase() : 'LOCKED'}
              onPress={trainingAction}
              variant="primary"
              disabled={!activeTraining || isInjured || monster.fatigue >= 90}
              style={styles.sideBtn}
            />
            <MedievalButton
              label="BATTLE"
              onPress={() => navigation.navigate('Battle')}
              variant="secondary"
              style={styles.sideBtn}
            />
            <MedievalButton
              label="STABLE"
              onPress={() => navigation.navigate('Stable')}
              variant="secondary"
              style={styles.sideBtn}
            />
          </MedievalContainer>
        </View>
      </View>

      <MedievalContainer variant="iron" borderType="ornate" style={styles.footerBar}>
        <View style={styles.footerItem}>
          <MedievalText variant="tiny" color={medievalColors.tarnishedSilver}>LOYA</MedievalText>
          <MedievalText variant="h3" color={medievalColors.parchment}>{loyaltyLabel}</MedievalText>
        </View>
        <View style={styles.footerItem}>
          <MedievalText variant="tiny" color={medievalColors.tarnishedSilver}>SPECIES</MedievalText>
          <MedievalText variant="h3" color={medievalColors.parchment}>{monster.species.toUpperCase()}</MedievalText>
        </View>
      </MedievalContainer>

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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  summonBtn: {
    marginTop: medievalSpacing.lg,
    alignSelf: 'center',
  },
  badge: {
    marginTop: medievalSpacing.xs,
  },
  ageText: {
    marginTop: medievalSpacing.xs,
  },
  viewport: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    padding: medievalSpacing.xl,
  },
  injuredBadge: {
    marginTop: medievalSpacing.md,
  },
  feedback: {
    marginTop: medievalSpacing.md,
    textAlign: 'center',
  },
  vitalRow: {
    flexDirection: 'row',
    gap: medievalSpacing.sm,
    justifyContent: 'space-between',
    marginTop: medievalSpacing.md,
  },
  eggNote: {
    textAlign: 'center',
    marginVertical: medievalSpacing.lg,
  },
  sectionTitle: {
    marginBottom: medievalSpacing.md,
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
  headerRow: {
    flexDirection: 'row',
    gap: medievalSpacing.sm,
    marginBottom: medievalSpacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: medievalSpacing.md,
  },
  miniCard: {
    flex: 1,
    paddingVertical: medievalSpacing.sm,
    paddingHorizontal: medievalSpacing.md,
  },
  summaryLabel: {
    letterSpacing: 2,
    marginBottom: medievalSpacing.xs,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    gap: medievalSpacing.md,
    paddingHorizontal: medievalSpacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidePanel: {
    width: 220,
  },
  sidePanelCard: {
    padding: medievalSpacing.md,
  },
  sideBtn: {
    width: '100%',
    marginBottom: medievalSpacing.sm,
  },
  centerPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageArea: {
    width: '100%',
    minHeight: 320,
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monsterMover: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -36 },
      { translateY: -36 },
    ],
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: medievalSpacing.md,
    paddingVertical: medievalSpacing.sm,
    marginTop: medievalSpacing.md,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
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
