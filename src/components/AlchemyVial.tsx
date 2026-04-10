/**
 * AlchemyVial - Alchemical vial-style stat bar with liquid animation
 * Visualizes monster vitals and stats as glowing liquids in glass vials
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { medievalColors, medievalSpacing, medievalTypography } from '../theme/medievalTheme';

interface AlchemyVialProps {
  label: string;
  value: number;
  max: number;
  color: string;
  height?: number;
}

export function AlchemyVial({
  label,
  value,
  max,
  color,
  height = 120,
}: AlchemyVialProps) {
  const fillProgress = useSharedValue(Math.min(value / max, 1));

  useEffect(() => {
    fillProgress.value = withTiming(Math.min(value / max, 1), { duration: 400 });
  }, [value, max, fillProgress]);

  const percentage = Math.round((value / max) * 100);

  const liquidStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(fillProgress.value, 0), 1) * 100}%`,
    backgroundColor: color,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percentageText, { color }]}>
          {percentage}%
        </Text>
      </View>

      <View style={[styles.vialWrapper, { height }]}>        
        <Animated.View style={[styles.liquidFill, liquidStyle]} />
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.valueText}>
          {value.toFixed(0)} / {max.toFixed(0)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: medievalSpacing.sm,
    paddingHorizontal: medievalSpacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: medievalSpacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: medievalColors.parchment,
    letterSpacing: 1,
    fontFamily: medievalTypography.monoFamily,
    textTransform: 'uppercase',
  },
  vialWrapper: {
    position: 'relative',
    width: 180,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  liquidFill: {
    height: '100%',
    width: '0%',
  },
  valueRow: {
    marginTop: medievalSpacing.xs,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 12,
    color: medievalColors.parchment,
    fontFamily: medievalTypography.monoFamily,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: medievalTypography.monoFamily,
  },
});
