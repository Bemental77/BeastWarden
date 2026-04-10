import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle;
}

export function ActionButton({ label, onPress, disabled = false, color = '#37474F', style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: disabled ? '#1C1C1C' : color }, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#455A64',
    minWidth: 80,
  },
  label: {
    color: '#ECEFF1',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  labelDisabled: {
    color: '#455A64',
  },
});
