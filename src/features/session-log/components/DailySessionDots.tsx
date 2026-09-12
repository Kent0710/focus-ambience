import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTimer } from '../../timer/state/useTimer';
import { useAppTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { TIMER_CONFIG } from '../../../core/constants/config';

export const DailySessionDots: React.FC = () => {
  const { todayCompletedCount, todayTotalMinutes } = useTimer();
  const { colors } = useAppTheme();

  const totalDots = TIMER_CONFIG.DAILY_DOTS_TARGET;
  const dots = Array.from({ length: totalDots }, (_, i) => i < todayCompletedCount);

  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {dots.map((filled, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: filled ? colors.dotFilled : colors.dotEmpty,
                borderColor: colors.border,
              },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.caption, { color: colors.textSecondary }]}>
        {todayCompletedCount === 0
          ? 'DAILY FOCUS'
          : `${todayCompletedCount} ${todayCompletedCount === 1 ? 'SESSION' : 'SESSIONS'} · ${todayTotalMinutes}M`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
  },
  caption: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.micro,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.extraWide,
    textTransform: 'uppercase',
  },
});
