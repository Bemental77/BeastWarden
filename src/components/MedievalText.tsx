/**
 * MedievalText - Typography wrapper for consistent medieval styling
 * Provides semantic text components for headers, body, and captions
 */

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { medievalColors, medievalTypography } from '../theme/medievalTheme';

interface MedievalTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny';
  color?: string;
  weight?: 'light' | 'normal' | 'semibold' | 'bold';
}

export function MedievalText({
  variant = 'body',
  color = medievalColors.parchment,
  weight = 'normal',
  style,
  children,
  ...props
}: MedievalTextProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'tiny':
        return styles.tiny;
      default:
        return styles.body;
    }
  };

  const getWeightStyle = () => {
    switch (weight) {
      case 'light':
        return { fontWeight: '300' };
      case 'semibold':
        return { fontWeight: '600' };
      case 'bold':
        return { fontWeight: '700' };
      case 'normal':
      default:
        return { fontWeight: '400' };
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        { color },
        getWeightStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: medievalTypography.headerFamily,
    letterSpacing: 1,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: medievalTypography.headerFamily,
    letterSpacing: 0.5,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: medievalTypography.headerFamily,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: medievalTypography.bodyFamily,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: medievalTypography.bodyFamily,
    lineHeight: 16,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: medievalTypography.monoFamily,
    letterSpacing: 1,
    lineHeight: 14,
  },
});
