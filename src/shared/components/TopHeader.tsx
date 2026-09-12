import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppTheme } from '../../core/theme/ThemeContext';
import { typography } from '../../core/theme/typography';

export const TopHeader: React.FC = () => {
  const { isDark, toggleTheme, colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.brandText, { color: colors.textPrimary }]}>
        MONO FOCUS
      </Text>

      <Pressable
        onPress={toggleTheme}
        style={[
          styles.themeToggle,
          {
            borderColor: colors.border,
            backgroundColor: colors.pillBackground,
          },
        ]}
        accessibilityLabel={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      >
        <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
          {isDark ? 'LIGHT' : 'DARK'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  brandText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.extraWide,
  },
  themeToggle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.micro,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
});
