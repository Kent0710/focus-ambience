import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { useTimer } from '../state/useTimer';
import { useAppTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { formatTime } from '../../../shared/utils/formatTime';
import { hapticEngine } from '../../../core/haptics/HapticEngine';

export const CountdownDisplay: React.FC = () => {
  const {
    status,
    remainingSeconds,
    durationMinutes,
    toggleSession,
    resetSession,
    adjustDurationMinutes,
  } = useTimer();
  const { colors } = useAppTheme();

  const dragAccumulatorRef = useRef(0);
  const DRAG_STEP_THRESHOLD = 18; // pixels per minute step

  const { minutes, seconds } = formatTime(remainingSeconds);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (status !== 'IDLE') return;

    const translationY = event.nativeEvent.translationY;
    const delta = -translationY - dragAccumulatorRef.current;

    if (Math.abs(delta) >= DRAG_STEP_THRESHOLD) {
      const step = delta > 0 ? 1 : -1;
      adjustDurationMinutes(step);
      hapticEngine.tick();
      dragAccumulatorRef.current += step * DRAG_STEP_THRESHOLD;
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      dragAccumulatorRef.current = 0;
    }
  };

  const getStatusCaption = () => {
    switch (status) {
      case 'RUNNING':
        return 'TAP TO PAUSE';
      case 'PAUSED':
        return 'TAP TO RESUME · HOLD TO RESET';
      case 'COMPLETED':
        return 'SESSION COMPLETE';
      case 'IDLE':
      default:
        return 'DRAG TO ADJUST · TAP TO START';
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={status === 'IDLE'}
    >
      <View style={styles.outerContainer}>
        <Pressable
          onPress={toggleSession}
          onLongPress={status === 'PAUSED' ? resetSession : undefined}
          delayLongPress={500}
          style={styles.pressableArea}
          accessibilityRole="button"
          accessibilityLabel={`Focus timer at ${minutes} minutes and ${seconds} seconds. Status: ${status}`}
        >
          <View style={styles.timeWrapper}>
            <Text
              style={[
                styles.digits,
                {
                  color: status === 'PAUSED' ? colors.textSecondary : colors.textPrimary,
                },
              ]}
              numberOfLines={1}
            >
              {minutes}
              <Text style={{ color: colors.textSecondary }}>:</Text>
              {seconds}
            </Text>
          </View>

          {/* Minimalist Flat Status & Duration Caption */}
          <View style={styles.captionContainer}>
            <Text style={[styles.statusCaption, { color: colors.textSecondary }]}>
              {getStatusCaption()}
            </Text>

            {status === 'IDLE' && (
              <Text style={[styles.durationSub, { color: colors.textTertiary }]}>
                {durationMinutes} MINUTE BLOCK
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pressableArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digits: {
    fontFamily: typography.tabularFont,
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.light,
    letterSpacing: typography.letterSpacing.tight,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  captionContainer: {
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  statusCaption: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  durationSub: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.micro,
    fontWeight: typography.weights.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
