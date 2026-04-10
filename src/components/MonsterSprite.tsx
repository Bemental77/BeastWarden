import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifecycleStage } from '../types';

interface Props {
  color: string;
  stage: LifecycleStage;
  name: string;
}

const STAGE_SIZE: Record<LifecycleStage, number> = {
  egg:   64,
  baby:  72,
  youth: 88,
  adult: 110,
  elder: 100,
  dead:  80,
};

const STAGE_SHAPE: Record<LifecycleStage, number> = {
  egg:   32,  // very rounded = oval-ish
  baby:  16,
  youth: 12,
  adult: 8,
  elder: 8,
  dead:  4,
};

const STAGE_LABEL: Record<LifecycleStage, string> = {
  egg:   '◎',
  baby:  '▲',
  youth: '◆',
  adult: '■',
  elder: '★',
  dead:  '✕',
};

export function MonsterSprite({ color, stage, name }: Props) {
  const size = STAGE_SIZE[stage];
  const radius = STAGE_SHAPE[stage];
  const isDead = stage === 'dead';
  const effectiveColor = isDead ? '#37474F' : color;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.sprite,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: effectiveColor,
            borderColor: isDead ? '#263238' : darken(color),
          },
        ]}
      >
        <Text style={styles.stageGlyph}>{STAGE_LABEL[stage]}</Text>
      </View>
      {isDead && <Text style={styles.deadLabel}>DECEASED</Text>}
    </View>
  );
}

/** Approximate darkening by reducing hex brightness ~30% */
function darken(hex: string): string {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, ((n >> 16) & 0xff) - 60);
    const g = Math.max(0, ((n >> 8) & 0xff) - 60);
    const b = Math.max(0, (n & 0xff) - 60);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch {
    return '#000';
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  sprite: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  stageGlyph: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 24,
  },
  deadLabel: {
    color: '#546E7A',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 6,
  },
});
