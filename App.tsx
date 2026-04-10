import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MedievalText } from './src/components/MedievalText';
import { medievalColors, medievalSpacing, medievalTypography } from './src/theme/medievalTheme';

function MedievalLoadingScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingContainer}>
      {/* Parchment background */}
      <View style={styles.parchmentBackground} />

      {/* Animated wax seal */}
      <Animated.View
        style={[
          styles.sealContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Svg width="120" height="120" viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={medievalColors.burnishedGold} stopOpacity="1" />
                <Stop offset="100%" stopColor={medievalColors.royalBurgundy} stopOpacity="0.8" />
              </LinearGradient>
              <LinearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
              </LinearGradient>
            </Defs>

            {/* Outer seal ring */}
            <Circle cx="60" cy="60" r="55" fill="url(#sealGradient)" />
            {/* Inner shadow ring */}
            <Circle cx="60" cy="60" r="50" fill="none" stroke={medievalColors.iron} strokeWidth="2" opacity="0.3" />
            {/* Decorative inner circles */}
            <Circle cx="60" cy="60" r="35" fill="none" stroke={medievalColors.parchment} strokeWidth="1" opacity="0.5" />
            <Circle cx="60" cy="60" r="20" fill="none" stroke={medievalColors.parchment} strokeWidth="0.5" opacity="0.3" />

            {/* Inner glow effect */}
            <Circle cx="60" cy="60" r="45" fill="url(#innerGlow)" />

            {/* Central emblem - could be a sword or monster silhouette */}
            <Path
              d="M45 35 L50 25 L55 35 L65 30 L60 40 L70 45 L60 50 L65 60 L55 55 L50 65 L45 55 L35 60 L40 50 L30 45 L40 40 L35 30 Z"
              fill={medievalColors.parchment}
              opacity="0.9"
            />
          </Svg>
        </Animated.View>

        <MedievalText
          variant="h2"
          color={medievalColors.parchment}
          style={styles.loadingTitle}
        >
          BEAST WARDEN
        </MedievalText>

        <MedievalText
          variant="caption"
          color={medievalColors.burnishedGold}
          style={styles.loadingSubtitle}
        >
          Loading ancient tomes...
        </MedievalText>
      </Animated.View>

      {/* Decorative corner elements */}
      <View style={styles.cornerDecoration}>
        <Svg width="40" height="40" viewBox="0 0 40 40">
          <Path
            d="M5 5 L35 5 L35 35 L5 35 Z M10 10 L30 10 M10 15 L25 15 M10 20 L30 20 M10 25 L20 25 M10 30 L25 30"
            stroke={medievalColors.tarnishedSilver}
            strokeWidth="1"
            opacity="0.3"
          />
        </Svg>
      </View>
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show loading for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={medievalColors.iron} />
        <MedievalLoadingScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={medievalColors.iron} />
      <View style={styles.root}>
        <AppNavigator />
        {/* Medieval noise overlay - 5% opacity texture */}
        <View style={styles.noiseOverlay} pointerEvents="none" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: medievalColors.iron,
  },
  noiseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    pointerEvents: 'none',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: medievalColors.iron,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  parchmentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: medievalColors.parchment,
    opacity: 0.1,
  },
  sealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loadingTitle: {
    marginTop: medievalSpacing.lg,
    letterSpacing: 3,
    textAlign: 'center',
  },
  loadingSubtitle: {
    marginTop: medievalSpacing.sm,
    textAlign: 'center',
    opacity: 0.8,
  },
  cornerDecoration: {
    position: 'absolute',
    top: medievalSpacing.xl,
    right: medievalSpacing.xl,
    opacity: 0.4,
  },
});
