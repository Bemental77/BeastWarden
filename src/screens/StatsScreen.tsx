import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useMonster } from '../hooks/useMonster';
import { MonsterSprite } from '../components/MonsterSprite';
import { AlchemyVial } from '../components/AlchemyVial';
import { MedievalText } from '../components/MedievalText';
import { MedievalContainer } from '../components/MedievalContainer';
import { getSpecies } from '../constants/species';
import { MonsterStats } from '../types';
import { 
  medievalColors, 
  medievalSpacing, 
  medievalTypography,
  medievalShadows 
} from '../theme/medievalTheme';

const STAT_COLORS: Record<keyof MonsterStats, string> = {
  life:         medievalColors.bloodRed,
  power:        medievalColors.warning,
  defense:      medievalColors.alchemyGreen,
  speed:        medievalColors.vialBlue,
  intelligence: '#7B1FA2',
  skill:        '#E65100',
};

const STAT_MAX = 999;

export function StatsScreen() {
  const { monster, loading } = useMonster();

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <MedievalText variant="h2" color={medievalColors.parchment}>
          LOADING...
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
          style={styles.subEmpty}
        >
          Summon a beast from the Ranch.
        </MedievalText>
      </View>
    );
  }

  const species = getSpecies(monster.species);
  const lifespanPct = (monster.age / monster.lifespan) * 100;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with sprite and info */}
        <MedievalContainer variant="iron" borderType="ornate">
          <View style={styles.spriteRow}>
            <MonsterSprite color={monster.spriteColor} stage={monster.lifecycleStage} name={monster.name} />
            <View style={styles.headerInfo}>
              <MedievalText variant="h2" color={medievalColors.parchment}>
                {monster.name}
              </MedievalText>
              <MedievalText 
                variant="caption" 
                color={medievalColors.burnishedGold}
                style={styles.specsText}
              >
                {species?.name ?? monster.species}
              </MedievalText>
              <MedievalText 
                variant="tiny" 
                color={medievalColors.tarnishedSilver}
                style={styles.stageText}
              >
                {monster.lifecycleStage.toUpperCase()}
              </MedievalText>
              {monster.wins > 0 && (
                <MedievalText 
                  variant="tiny" 
                  color={medievalColors.burnishedGold}
                  weight="semibold"
                  style={styles.winsText}
                >
                  ★ {monster.wins} TOURNAMENT WIN{monster.wins !== 1 ? 'S' : ''}
                </MedievalText>
              )}
            </View>
          </View>
        </MedievalContainer>

        {/* Lifespan tracker */}
        <MedievalContainer variant="oak" borderType="simple">
          <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
            ◆ AGE & LIFESPAN
          </MedievalText>
          <AlchemyVial 
            label="Lifespan" 
            value={monster.age} 
            max={monster.lifespan} 
            color={medievalColors.tarnishedSilver}
            height={100}
          />
          <View style={styles.ageRow}>
            <MedievalText variant="tiny" color={medievalColors.tarnishedSilver}>
              Day {monster.age.toFixed(2)}
            </MedievalText>
            <MedievalText variant="tiny" color={medievalColors.tarnishedSilver}>
              Max: {monster.lifespan} days
            </MedievalText>
          </View>
        </MedievalContainer>

        {/* Combat Stats */}
        <MedievalContainer variant="oak" borderType="simple">
          <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
            ◆ COMBAT STATS
          </MedievalText>
          {(Object.entries(monster.stats) as [keyof MonsterStats, number][]).map(([key, val]) => (
            <AlchemyVial
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={val}
              max={STAT_MAX}
              color={STAT_COLORS[key]}
              height={100}
            />
          ))}
        </MedievalContainer>

        {/* Inherited Bonus */}
        {monster.inheritedBonus && Object.keys(monster.inheritedBonus).length > 0 && (
          <MedievalContainer variant="iron" borderType="ornate">
            <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
              ◆ INHERITED LEGACY
            </MedievalText>
            {(Object.entries(monster.inheritedBonus) as [keyof MonsterStats, number][]).map(([key, val]) => (
              <MedievalText 
                key={key} 
                variant="body" 
                color={medievalColors.alchemyGreen}
                weight="semibold"
                style={styles.bonusStat}
              >
                ✦ +{val} {key.toUpperCase()}
              </MedievalText>
            ))}
          </MedievalContainer>
        )}

        {/* Condition */}
        <MedievalContainer variant="oak" borderType="simple">
          <MedievalText variant="h3" color={medievalColors.parchment} style={styles.sectionTitle}>
            ◆ CONDITION
          </MedievalText>
          <AlchemyVial label="Hunger" value={monster.hunger} max={100} color={medievalColors.warning} height={100} />
          <AlchemyVial label="Mood" value={monster.mood} max={100} color={medievalColors.vialBlue} height={100} />
          <AlchemyVial label="Fatigue" value={monster.fatigue} max={100} color="#7B1FA2" height={100} />

          {monster.injuryUntil && Date.now() < monster.injuryUntil && (
            <MedievalText 
              variant="tiny" 
              color={medievalColors.bloodRed}
              weight="semibold"
              style={styles.injuryNote}
            >
              ⚠ INJURED — recovers in {Math.ceil((monster.injuryUntil - Date.now()) / 60000)} min
            </MedievalText>
          )}
        </MedievalContainer>

        {/* Species Info */}
        {species && (
          <MedievalContainer variant="parchment" borderType="ornate">
            <MedievalText variant="h3" color={medievalColors.iron} style={styles.sectionTitle}>
              ◆ SPECIES LORE
            </MedievalText>
            <MedievalText 
              variant="body" 
              color={medievalColors.iron}
              style={styles.speciesDesc}
            >
              {species.description}
            </MedievalText>
          </MedievalContainer>
        )}
      </ScrollView>
    </View>
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
  subEmpty: { 
    marginTop: medievalSpacing.sm 
  },
  spriteRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: medievalSpacing.lg,
    padding: medievalSpacing.md,
  },
  headerInfo: { 
    flex: 1 
  },
  specsText: { 
    marginTop: medievalSpacing.xs 
  },
  stageText: { 
    letterSpacing: 1,
    marginTop: medievalSpacing.sm 
  },
  winsText: { 
    marginTop: medievalSpacing.sm 
  },
  sectionTitle: {
    marginBottom: medievalSpacing.md,
  },
  ageRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: medievalSpacing.md,
    paddingHorizontal: medievalSpacing.md,
  },
  bonusStat: { 
    marginBottom: medievalSpacing.sm,
    paddingHorizontal: medievalSpacing.md,
  },
  injuryNote: { 
    marginTop: medievalSpacing.md, 
    paddingHorizontal: medievalSpacing.md,
  },
  speciesDesc: { 
    lineHeight: 22,
    padding: medievalSpacing.md,
  },
});
