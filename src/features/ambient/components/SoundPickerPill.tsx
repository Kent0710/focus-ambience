import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAmbient } from '../state/useAmbient';
import { useAppTheme } from '../../../core/theme/ThemeContext';
import { typography } from '../../../core/theme/typography';
import { SOUNDSCAPE_PRESETS } from '../presets';

export const SoundPickerPill: React.FC = () => {
  const { activeSoundId, activePreset, nextSound, prevSound, selectSound } = useAmbient();
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {/* Sound Selection Carousel Bar */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.pillBackground,
            borderColor: colors.pillBorder,
          },
        ]}
      >
        <Pressable
          onPress={prevSound}
          style={styles.arrowButton}
          hitSlop={12}
          accessibilityLabel="Previous ambient sound"
        >
          <Text style={[styles.arrowText, { color: colors.textSecondary }]}>‹</Text>
        </Pressable>

        <Pressable onPress={nextSound} style={styles.centerPill}>
          <Text style={[styles.soundName, { color: colors.textPrimary }]}>
            {activePreset.label.toUpperCase()}
          </Text>
        </Pressable>

        <Pressable
          onPress={nextSound}
          style={styles.arrowButton}
          hitSlop={12}
          accessibilityLabel="Next ambient sound"
        >
          <Text style={[styles.arrowText, { color: colors.textSecondary }]}>›</Text>
        </Pressable>
      </View>

      {/* Preset Indicators (Flat 5 segments) */}
      <View style={styles.indicatorsRow}>
        {SOUNDSCAPE_PRESETS.map((preset) => {
          const isActive = preset.id === activeSoundId;
          return (
            <Pressable
              key={preset.id}
              onPress={() => selectSound(preset.id)}
              hitSlop={8}
            >
              <View
                style={[
                  styles.segmentDot,
                  {
                    backgroundColor: isActive ? colors.textPrimary : colors.border,
                    width: isActive ? 16 : 4,
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.subLabel, { color: colors.textTertiary }]}>
        {activePreset.subLabel.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    minWidth: 200,
  },
  arrowButton: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: typography.weights.light,
  },
  centerPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  soundName: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.wide,
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  segmentDot: {
    height: 3,
    borderRadius: 1.5,
  },
  subLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.micro,
    fontWeight: typography.weights.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
});
