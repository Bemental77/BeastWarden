/**
 * MedievalButton - Stone-textured button with 3D sink effect
 * Simulates physical weight when pressed
 */

import React, { useState } from 'react';
import { ImageBackground, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { medievalColors, medievalSpacing, medievalShadows, medievalTypography } from '../theme/medievalTheme';
import { GestureResponderEvent, Pressable, Text } from 'react-native';

interface MedievalButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function MedievalButton({
  label,
  onPress,
  style,
  variant = 'primary',
  disabled = false,
}: MedievalButtonProps) {
  const pressProgress = useSharedValue(0);

  const variantStyles = {
    primary: {
      backgroundColor: medievalColors.ironBackground,
      borderColor: medievalColors.burnishedGold,
    },
    secondary: {
      backgroundColor: medievalColors.darkOak,
      borderColor: medievalColors.tarnishedSilver,
    },
    danger: {
      backgroundColor: medievalColors.royalBurgundy,
      borderColor: medievalColors.bloodRed,
    },
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          pressProgress.value,
          [0, 1],
          [0, 5],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      pressProgress.value,
      [0, 1],
      [1, 0.95],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (pressProgress.value = 1)}
        onPressOut={() => (pressProgress.value = 0)}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          variantStyles[variant],
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...medievalShadows.medium,
  },
  pressable: {
    paddingVertical: medievalSpacing.md,
    paddingHorizontal: medievalSpacing.lg,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: medievalColors.iron,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: medievalColors.parchment,
    letterSpacing: 1,
    fontFamily: medievalTypography.monoFamily,
  },
  disabledText: {
    color: medievalColors.tarnishedSilver,
  },
});
