import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { RanchScreen } from '../screens/RanchScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { BattleScreen } from '../screens/BattleScreen';
import { StableScreen } from '../screens/StableScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontFamily: 'monospace',
        fontSize: 10,
        color: focused ? '#ECEFF1' : '#37474F',
        letterSpacing: 1,
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0D0D0D', borderBottomColor: '#1E1E1E', borderBottomWidth: 1 },
          headerTintColor: '#B0BEC5',
          headerTitleStyle: { fontFamily: 'monospace', letterSpacing: 3, fontSize: 13 },
          tabBarStyle: { backgroundColor: '#0D0D0D', borderTopColor: '#1E1E1E', borderTopWidth: 1, height: 56 },
          tabBarActiveTintColor: '#ECEFF1',
          tabBarInactiveTintColor: '#37474F',
          tabBarLabelStyle: { fontFamily: 'monospace', fontSize: 10, letterSpacing: 1 },
        }}
      >
        <Tab.Screen
          name="Ranch"
          component={RanchScreen}
          options={{
            title: 'RANCH',
            tabBarLabel: 'RANCH',
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: 'STATS',
            tabBarLabel: 'STATS',
          }}
        />
        <Tab.Screen
          name="Battle"
          component={BattleScreen}
          options={{
            title: 'BATTLE',
            tabBarLabel: 'BATTLE',
          }}
        />
        <Tab.Screen
          name="Stable"
          component={StableScreen}
          options={{
            title: 'STABLE',
            tabBarLabel: 'STABLE',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
