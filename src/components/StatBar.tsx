import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: number;
  max?: number;
  color?: string;
  compact?: boolean;
}

export function StatBar({ label, value, max = 100, color = '#4CAF50', compact = false }: Props) {
  const pct = Math.min(1, Math.max(0, value / max));
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
      </View>
      {!compact && (
        <Text style={styles.value}>
          {Math.round(value)}/{max}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  compact: {
    marginVertical: 2,
  },
  label: {
    color: '#B0BEC5',
    fontFamily: 'monospace',
    fontSize: 13,
    width: 90,
  },
  labelCompact: {
    fontSize: 11,
    width: 70,
  },
  track: {
    flex: 1,
    height: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  value: {
    color: '#78909C',
    fontFamily: 'monospace',
    fontSize: 11,
    width: 52,
    textAlign: 'right',
  },
});
