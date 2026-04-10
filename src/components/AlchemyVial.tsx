/**
 * AlchemyVial - Alchemical vial-style stat bar with liquid animation
 * Visualizes monster vitals and stats as glowing liquids in glass vials
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
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
    fillProgress.value = Math.min(value / max, 1);
  }, [value, max, fillProgress]);

  const percentage = Math.round((value / max) * 100);

  const liquidStyle = useAnimatedStyle(() => ({
    height: interpolate(
      fillProgress.value,
      [0, 1],
      [0, height - 40], // Account for borders
      Extrapolate.CLAMP
    ),
  }));

  // Use color to determine gradient
  const isBlue = color.includes('1565C0') || color === '#0D3680';
  const isGreen = color.includes('2E7D32') || color === '#1B5E20';
  const isRed = color.includes('C62828') || color === '#E53935';

  let gradientColor1 = color;
  let gradientColor2 = color;

  if (isBlue) {
    gradientColor1 = '#1A76D2';
    gradientColor2 = '#093D7A';
  } else if (isGreen) {
    gradientColor1 = '#4CAF50';
    gradientColor2 = '#1B5E20';
  } else if (isRed) {
    gradientColor1 = '#EF5350';
    gradientColor2 = '#C62828';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.vialWrapper, { height }]}>
        {/* Vial glass effect with SVG borders */}
        <Svg width="100%" height="100%" style={styles.vialSvg}>
          <Defs>
            <LinearGradient id={`liquidGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={gradientColor1} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={gradientColor2} stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="glassHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          {/* Vial outline */}
          <Rect
            x="10%"
            y="5%"
            width="80%"
            height="90%"
            fill="none"
            stroke={medievalColors.iron}
            strokeWidth="2"
            rx="4"
          />

          {/* Glass highlight */}
          <Rect
            x="10%"
            y="5%"
            width="15%"
            height="90%"
            fill="url(#glassHighlight)"
            rx="4"
          />
        </Svg>

        {/* Liquid fill with animation */}
        <Animated.View
          style={[
            styles.liquidContainer,
            liquidStyle,
            { height: height - 40 },
          ]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={gradientColor1} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={gradientColor2} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="10%"
              y="0%"
              width="80%"
              height="100%"
              fill="url(#liquidGrad)"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Value display */}
      <View style={styles.valueRow}>
        <Text style={styles.valueText}>
          {value.toFixed(0)} / {max.toFixed(0)}
        </Text>
        <Text style={[styles.percentageText, { color }]}>
          {percentage}%
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: medievalColors.parchment,
    marginBottom: medievalSpacing.xs,
    letterSpacing: 1,
    fontFamily: medievalTypography.monoFamily,
    textTransform: 'uppercase',
  },
  vialWrapper: {
    position: 'relative',
    justifyContent: 'flex-end',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: medievalColors.iron,
  },
  vialSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  liquidContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: medievalSpacing.xs,
    paddingHorizontal: medievalSpacing.xs,
  },
  valueText: {
    fontSize: 10,
    color: medievalColors.tarnishedSilver,
    fontFamily: medievalTypography.monoFamily,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: medievalTypography.monoFamily,
  },
});
