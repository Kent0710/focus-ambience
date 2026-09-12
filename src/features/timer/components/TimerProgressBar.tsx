import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTimer } from '../state/useTimer';
import { useAppTheme } from '../../../core/theme/ThemeContext';

export const TimerProgressBar: React.FC = () => {
  const { progress, status } = useTimer();
  const { colors } = useAppTheme();

  if (status === 'IDLE') {
    return <View style={[styles.track, { backgroundColor: colors.border }]} />;
  }

  const percentWidth = `${Math.min(100, Math.max(0, progress * 100))}%` as `${number}%`;

  return (
    <View style={[styles.track, { backgroundColor: colors.border }]}>
      <View
        style={[
          styles.fill,
          {
            width: percentWidth,
            backgroundColor: colors.textPrimary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 1,
    width: Dimensions.get('window').width * 0.6,
    overflow: 'hidden',
    marginVertical: 12,
  },
  fill: {
    height: '100%',
  },
});
