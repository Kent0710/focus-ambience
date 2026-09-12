export type SoundscapeId = 'rain' | 'white-noise' | 'brown-noise' | 'cafe' | 'silence';

export interface SoundscapePreset {
  id: SoundscapeId;
  label: string;
  subLabel: string;
  source: any;
}

export const SOUNDSCAPE_PRESETS: SoundscapePreset[] = [
  {
    id: 'rain',
    label: 'Rain',
    subLabel: 'Gentle steady rainfall',
    source: require('../../../assets/audio/rain.wav'),
  },
  {
    id: 'white-noise',
    label: 'White Noise',
    subLabel: 'Even focus static',
    source: require('../../../assets/audio/white-noise.wav'),
  },
  {
    id: 'brown-noise',
    label: 'Brown Noise',
    subLabel: 'Deep low resonance',
    source: require('../../../assets/audio/brown-noise.wav'),
  },
  {
    id: 'cafe',
    label: 'Café',
    subLabel: 'Warm room ambience',
    source: require('../../../assets/audio/cafe.wav'),
  },
  {
    id: 'silence',
    label: 'Silence',
    subLabel: 'Pure silent timer',
    source: null,
  },
];

export const COMPLETION_BELL_SOURCE = require('../../../assets/audio/completion-bell.wav');
