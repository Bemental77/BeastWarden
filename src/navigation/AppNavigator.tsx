import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RanchScreen } from '../screens/RanchScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { BattleScreen } from '../screens/BattleScreen';
import { StableScreen } from '../screens/StableScreen';
import { medievalColors, medievalTypography, medievalSpacing } from '../theme/medievalTheme';

const Tab = createBottomTabNavigator();

/**
 * Wax Seal Icon Component
 * Renders as a circular wax seal with tab label inside
 */
function WaxSealIcon({ label, focused }: { label: string; focused: boolean }) {
  const sealColor = focused ? medievalColors.burnishedGold : medievalColors.tarnishedSilver;
  const textColor = focused ? medievalColors.royalBurgundy : medievalColors.iron;

  return (
    <View style={styles.sealContainer}>
      <Svg width="48" height="48" viewBox="0 0 48 48">
        <Defs>
          <LinearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={sealColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={sealColor} stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        {/* Outer seal ring */}
        <Circle cx="24" cy="24" r="22" fill="url(#sealGradient)" />
        {/* Inner shadow */}
        <Circle cx="24" cy="24" r="20" fill="none" stroke={textColor} strokeWidth="1" opacity="0.3" />
        {/* Decorative inner circle */}
        <Circle cx="24" cy="24" r="16" fill="none" stroke={textColor} strokeWidth="0.5" opacity="0.5" />
      </Svg>
      <Text style={[styles.sealLabel, { color: textColor }]}>{label.charAt(0)}</Text>
    </View>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: medievalColors.iron,
            borderBottomColor: medievalColors.burnishedGold,
            borderBottomWidth: 2,
            shadowColor: 'transparent',
          },
          headerTintColor: medievalColors.parchment,
          headerTitleStyle: {
            fontFamily: medievalTypography.headerFamily,
            letterSpacing: 2,
            fontSize: 18,
            fontWeight: '600',
            color: medievalColors.parchment,
          },
          // Iron Rack styled tab bar
          tabBarStyle: {
            backgroundColor: medievalColors.darkOak,
            borderTopColor: medievalColors.burnishedGold,
            borderTopWidth: 3,
            height: 72,
            paddingBottom: medievalSpacing.sm,
            paddingTop: medievalSpacing.sm,
            shadowColor: 'transparent',
            elevation: 8,
          },
          tabBarActiveTintColor: medievalColors.burnishedGold,
          tabBarInactiveTintColor: medievalColors.tarnishedSilver,
          tabBarLabelStyle: {
            fontFamily: medievalTypography.monoFamily,
            fontSize: 12,
            letterSpacing: 0.5,
            marginTop: 4,
            textTransform: 'uppercase',
          },
        }}
      >
        <Tab.Screen
          name="Ranch"
          component={RanchScreen}
          options={{
            title: '⚔ THE RANCH',
            tabBarLabel: 'RANCH',
            tabBarIcon: ({ focused }) => <WaxSealIcon label="RANCH" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: '📜 BESTIARY',
            tabBarLabel: 'STATS',
            tabBarIcon: ({ focused }) => <WaxSealIcon label="STATS" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Battle"
          component={BattleScreen}
          options={{
            title: '⚔ COMBAT',
            tabBarLabel: 'BATTLE',
            tabBarIcon: ({ focused }) => <WaxSealIcon label="BATTLE" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Stable"
          component={StableScreen}
          options={{
            title: '🪦 LEGACY',
            tabBarLabel: 'STABLE',
            tabBarIcon: ({ focused }) => <WaxSealIcon label="STABLE" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 48,
    height: 48,
  },
  sealLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: medievalTypography.monoFamily,
    letterSpacing: 0.5,
  },
});
