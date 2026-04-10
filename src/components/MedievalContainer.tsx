/**
 * MedievalContainer - A container with medieval aesthetic
 * Uses solid colors and borders for layered medieval styling
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { medievalColors, medievalSpacing, medievalShadows } from '../theme/medievalTheme';

interface MedievalContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'parchment' | 'iron' | 'oak';
  borderType?: 'none' | 'ornate' | 'simple';
  padding?: number;
}

export function MedievalContainer({
  children,
  style,
  variant = 'oak',
  borderType = 'simple',
  padding = medievalSpacing.md,
}: MedievalContainerProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'parchment':
        return medievalColors.parchment;
      case 'iron':
        return medievalColors.iron;
      case 'oak':
      default:
        return medievalColors.darkOak;
    }
  };

  const borderStyle = getBorderStyle(borderType);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), padding },
        borderStyle,
        medievalShadows.medium,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function getBorderStyle(borderType: string) {
  switch (borderType) {
    case 'ornate':
      return {
        borderWidth: 3,
        borderColor: medievalColors.burnishedGold,
        borderRadius: 8,
      };
    case 'simple':
      return {
        borderWidth: 1,
        borderColor: medievalColors.tarnishedSilver,
        borderRadius: 4,
      };
    case 'none':
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
  },
});
