/**
 * Animation utilities for medieval interactive elements
 * Implements 3D button effects, vial animations, and transitions
 */

import { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

/**
 * Creates a "sink" effect for buttons when pressed
 * Simulates physical weight and depth
 */
export const useButtonSinkEffect = (pressProgress: Animated.SharedValue<number>) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          pressProgress.value,
          [0, 1],
          [0, 5], // 5px sink effect
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
};

/**
 * Creates a bubbling liquid effect for alchemical vials
 * Animates the fill level with jitter
 */
export const useVialLiquidEffect = (fillProgress: Animated.SharedValue<number>) => {
  return useAnimatedStyle(() => ({
    height: interpolate(
      fillProgress.value,
      [0, 1],
      [0, 100], // 100% of vial height
      Extrapolate.CLAMP
    ),
    opacity: interpolate(
      fillProgress.value,
      [0, 0.1, 1],
      [0.6, 0.8, 1],
      Extrapolate.CLAMP
    ),
  }));
};

/**
 * Creates a parchment scroll unroll animation for modals
 */
export const useScrollUnrollAnimation = (animationProgress: Animated.SharedValue<number>) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          animationProgress.value,
          [0, 1],
          [100, 0],
          Extrapolate.CLAMP
        ),
      },
      {
        scaleY: interpolate(
          animationProgress.value,
          [0, 1],
          [0.8, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));
};

/**
 * Page flip transition for screen navigation
 */
export const usePageFlipAnimation = (transitionProgress: Animated.SharedValue<number>) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        perspective: 1000,
      },
      {
        rotateY: interpolate(
          transitionProgress.value,
          [0, 1],
          [90, 0],
          Extrapolate.CLAMP
        ) as any,
      },
      {
        scaleX: interpolate(
          transitionProgress.value,
          [0, 0.5, 1],
          [0, 0.8, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      transitionProgress.value,
      [0, 0.5, 1],
      [0, 0.7, 1],
      Extrapolate.CLAMP
    ),
  }));
};

/**
 * Heavy slab slide for dungeon/battle transitions
 */
export const useHeavySlabAnimation = (transitionProgress: Animated.SharedValue<number>) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          transitionProgress.value,
          [0, 1],
          [200, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      transitionProgress.value,
      [0, 0.3, 1],
      [0, 0.8, 1],
      Extrapolate.CLAMP
    ),
  }));
};
