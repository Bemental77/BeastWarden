/**
 * MEDIEVALCORE THEME MIGRATION GUIDE
 * 
 * This guide provides patterns and examples for updating the remaining screens
 * to use the new medieval theme system. Follow these patterns to maintain
 * consistency across the entire app.
 */

// ============== COLOR USAGE ==============
// Replace all hardcoded colors with medievalColors imports:
// 
// OLD: backgroundColor: '#0D0D0D'
// NEW: backgroundColor: medievalColors.iron
//
// Color mapping guide:
// - Dark backgrounds: medievalColors.iron, medievalColors.darkOak
// - Text: medievalColors.parchment (light), medievalColors.iron (dark)
// - Accents: medievalColors.burnishedGold, medievalColors.royalBurgundy
// - Stat colors: Use dedicated colors from medievalColors or STAT_COLORS object
// - Stats bars/elements: medievalColors.alchemyGreen, medievalColors.vialBlue, etc.

// ============== TYPOGRAPHY ==============
// Replace FontFamily/FontSize patterns with MedievalText component:
//
// OLD: <Text style={{ fontFamily: 'monospace', fontSize: 14 }}>Hello</Text>
// NEW: <MedievalText variant="body">Hello</MedievalText>
//
// Available variants:
// - h1, h2, h3 (headers)
// - body (default paragraph)
// - caption (small text)
// - tiny (10px monospace, for UI elements)
//
// For specific styling needs:
// <MedievalText variant="body" color={medievalColors.burnishedGold} weight="semibold">
//   Text here
// </MedievalText>

// ============== BUTTONS ==============
// Replace ActionButton with MedievalButton for new-style buttons:
//
// OLD: <ActionButton label="FEED" onPress={handleFeed} color="#E65100" />
// NEW: <MedievalButton 
//   label="FEED" 
//   onPress={handleFeed} 
//   variant="primary" 
// />
//
// Button variants available:
// - primary (iron with gold accent)
// - secondary (dark oak with silver)
// - danger (burgundy with blood red)

// ============== STAT BARS ==============
// Replace existing StatBar components with AlchemyVial for more medieval feel:
//
// OLD: <StatBar label="Hunger" value={monster.hunger} color="#EF6C00" />
// NEW: <AlchemyVial label="Hunger" value={monster.hunger} max={100} color="#EF6C00" />
//
// The AlchemyVial provides:
// - Liquid fill animation
// - SVG-based vial design
// - Percentage display
// - Gradient fill effects

// ============== CONTAINERS ==============
// Wrap content sections with MedievalContainer:
//
// OLD: <View style={styles.section}>
// NEW: <MedievalContainer variant="oak" borderType="ornate">
//
// Container variants:
// - parchment: Light background (for important info)
// - iron: Dark metal background (for action areas)
// - oak: Dark wood background (default, for sections)
//
// Border types:
// - none: No border
// - simple: Thin silver border
// - ornate: Thick gold border with decorative rings

// ============== SHADOWS ==============
// Use predefined shadow styles from medievalTheme:
//
// OLD: shadow: { shadowColor: '#000', shadowOpacity: 0.2 }
// NEW: ...medievalShadows.medium
//
// Shadow levels available:
// - medievalShadows.none
// - medievalShadows.light
// - medievalShadows.medium
// - medievalShadows.heavy

// ============== SPACING ==============
// Use consistent spacing values:
// - medievalSpacing.xs = 4
// - medievalSpacing.sm = 8
// - medievalSpacing.md = 16
// - medievalSpacing.lg = 24
// - medievalSpacing.xl = 32
// - medievalSpacing.xxl = 48

// ============== SCREEN TEMPLATE ==============
// Use this as a starting point for updating each screen:
/*
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useMonster } from '../hooks/useMonster';
import { MedievalText } from '../components/MedievalText';
import { AlchemyVial } from '../components/AlchemyVial';
import { MedievalButton } from '../components/MedievalButton';
import { MedievalContainer } from '../components/MedievalContainer';
import { 
  medievalColors, 
  medievalSpacing, 
  medievalTypography,
  medievalShadows 
} from '../theme/medievalTheme';

export function ExampleScreen() {
  return (
    <ImageBackground
      source={require('../../assets/textures/parchment.png')}
      style={styles.screen}
      resizeMode="repeat"
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <MedievalContainer variant="iron" borderType="ornate">
          <MedievalText variant="h1">Screen Title</MedievalText>
          <MedievalText variant="caption" color={medievalColors.burnishedGold}>
            Subtitle or description
          </MedievalText>
        </MedievalContainer>

        {/* Content Section */}
        <MedievalContainer variant="oak" borderType="simple">
          <MedievalText variant="h2">Content Section</MedievalText>
          <AlchemyVial 
            label="Example Stat" 
            value={50} 
            max={100} 
            color={medievalColors.vialBlue}
          />
        </MedievalContainer>

        {/* Actions Section */}
        <View style={styles.actionRow}>
          <MedievalButton label="Action 1" onPress={() => {}} variant="primary" />
          <MedievalButton label="Action 2" onPress={() => {}} variant="secondary" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: medievalColors.iron,
  },
  content: {
    paddingHorizontal: medievalSpacing.md,
    paddingVertical: medievalSpacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: medievalSpacing.md,
    marginVertical: medievalSpacing.lg,
  },
});
*/

// ============== MODALS ==============
// Wrap modals with parchment appearance:
// Use the scrollUnrollAnimation utility for "unrolling parchment" effect
// Import: import { useScrollUnrollAnimation } from '../theme/animations'

// ============== KEY IMPORTS FOR EACH SCREEN ==============
import { medieval Colors, medievalTypography, medievalSpacing, medievalShadows, medievalBorders } from '../theme/medievalTheme';
import { MedievalText } from '../components/MedievalText';
import { AlchemyVial } from '../components/AlchemyVial';
import { MedievalButton } from '../components/MedievalButton';
import { MedievalContainer } from '../components/MedievalContainer';
import { useButtonSinkEffect, useVialLiquidEffect, useScrollUnrollAnimation } from '../theme/animations';

// ============== GRADUAL MIGRATION STRATEGY ==============
// 1. Replace colors first (lowest risk)
// 2. Update buttons (ActionButton → MedievalButton)
// 3. Replace stat bars (StatBar → AlchemyVial)
// 4. Wrap sections with MedievalContainer
// 5. Update typography (Text → MedievalText)
// 6. Add ImageBackground textures
// 7. Test thoroughly before moving to next screen

// ============== STAT COLOR PALETTE ==============
const STAT_COLORS: Record<string, string> = {
  life: medievalColors.bloodRed,
  power: '#EF6C00',           // Burnished gold-orange
  defense: medievalColors.alchemyGreen,
  speed: medievalColors.vialBlue,
  intelligence: '#7B1FA2',    // Purple
  skill: '#E65100',           // Orange
  hunger: '#EF6C00',
  mood: medievalColors.vialBlue,
  fatigue: '#7B1FA2',
};

// ============== TEXTURE SOURCES ==============
// The following textures are expected in assets/textures/:
// - parchment.png (light, for backgrounds)
// - leather.png (dark, for containers)
// - metal.png (for iron elements)
// - wood.png (for oak elements)
//
// If textures are missing, styles will work but appearance will be less rich
