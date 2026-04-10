import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifecycleStage } from '../types';

const STAGE_SIZE: Record<LifecycleStage, number> = {
  egg:   64,
  baby:  72,
  youth: 88,
  adult: 110,
  elder: 100,
  dead:  80,
};

interface Props {
  color: string;
  stage: LifecycleStage;
  name: string;
}

export function MonsterSprite({ color, stage, name }: Props) {
  const size = STAGE_SIZE[stage];
  const scale = size / 100;
  const isDead = stage === 'dead';
  const bodyColor = isDead ? '#5D5D5D' : color;
  const accentColor = isDead ? '#8E8E8E' : '#F4D35E';
  const wingColor = isDead ? '#4D4D4D' : '#8B2E0B';

  return (
    <View style={[styles.wrapper, { width: 180 * scale, height: 140 * scale }]}> 
      <View
        style={[
          styles.monsterBase,
          { backgroundColor: bodyColor, transform: [{ scale }] },
        ]}
      > 
        <View style={[styles.tail, { backgroundColor: bodyColor }]} />
        <View style={[styles.body, { backgroundColor: bodyColor }]}> 
          <View style={[styles.belly, { backgroundColor: accentColor }]} />
        </View>
        <View style={[styles.head, { backgroundColor: bodyColor }]}> 
          <View style={[styles.eye, { left: 12 }]} />
          <View style={[styles.eye, { right: 12 }]} />
          <View style={[styles.horn, { left: 6, backgroundColor: accentColor }]} />
          <View style={[styles.horn, { right: 6, backgroundColor: accentColor }]} />
        </View>
        <View style={[styles.wing, { backgroundColor: wingColor }]} />
        <View style={[styles.leg, { left: 16, backgroundColor: bodyColor }]} />
        <View style={[styles.leg, { right: 16, backgroundColor: bodyColor }]} />
      </View>
      {isDead && <Text style={styles.deadLabel}>DECEASED</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 140,
  },
  monsterBase: {
    position: 'relative',
    width: 160,
    height: 110,
    borderRadius: 40,
  },
  tail: {
    position: 'absolute',
    left: -28,
    top: 50,
    width: 48,
    height: 18,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    transform: [{ rotate: '-18deg' }],
  },
  body: {
    position: 'absolute',
    left: 24,
    top: 36,
    width: 72,
    height: 44,
    borderRadius: 24,
  },
  belly: {
    position: 'absolute',
    left: 8,
    top: 10,
    width: 56,
    height: 22,
    borderRadius: 14,
    opacity: 0.85,
  },
  head: {
    position: 'absolute',
    right: -12,
    top: 28,
    width: 42,
    height: 34,
    borderRadius: 16,
  },
  eye: {
    position: 'absolute',
    top: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  horn: {
    position: 'absolute',
    top: -8,
    width: 8,
    height: 16,
    borderRadius: 4,
  },
  wing: {
    position: 'absolute',
    left: 22,
    top: 8,
    width: 54,
    height: 48,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 30,
    transform: [{ rotate: '-18deg' }],
    opacity: 0.95,
  },
  leg: {
    position: 'absolute',
    bottom: -6,
    width: 10,
    height: 20,
    borderRadius: 6,
  },
  deadLabel: {
    color: '#E0E0E0',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 8,
  },
});
