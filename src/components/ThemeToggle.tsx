import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  style?: any;
}

export default function ThemeToggle({ style }: ThemeToggleProps) {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.toggleButton, { backgroundColor: theme.colors.surface }, style]}
      onPress={toggleTheme}
    >
      <Ionicons
        name={isDarkMode ? 'sunny' : 'moon'}
        size={20}
        color={theme.colors.text}
      />
      <Text style={[styles.toggleText, { color: theme.colors.text }]}>
        {isDarkMode ? 'Claro' : 'Escuro'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
});
