const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '../assets/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function writeWavHeader(sampleRate, numChannels, numSamples) {
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

function createWavFile(filename, sampleRate, durationSec, sampleGenerator) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const numChannels = 2;
  const header = writeWavHeader(sampleRate, numChannels, numSamples);
  const dataBuffer = Buffer.alloc(numSamples * numChannels * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const [leftSample, rightSample] = sampleGenerator(t, i, numSamples, sampleRate);

    const leftInt = Math.max(-32768, Math.min(32767, Math.floor(leftSample * 32767)));
    const rightInt = Math.max(-32768, Math.min(32767, Math.floor(rightSample * 32767)));

    dataBuffer.writeInt16LE(leftInt, i * 4);
    dataBuffer.writeInt16LE(rightInt, i * 4 + 2);
  }

  const filePath = path.join(audioDir, filename);
  fs.writeFileSync(filePath, Buffer.concat([header, dataBuffer]));
  console.log(`Generated ${filePath} (${(dataBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

const SAMPLE_RATE = 44100;
const LOOP_DURATION = 8.0; // 8 seconds seamless loop

// 1. White Noise (gentle bandpassed)
{
  createWavFile('white-noise.wav', SAMPLE_RATE, LOOP_DURATION, (t, i, total) => {
    // Crossfade at boundaries for 100% seamless looping
    const fadeLen = SAMPLE_RATE * 0.5;
    let fade = 1.0;
    if (i < fadeLen) fade = i / fadeLen;
    else if (i > total - fadeLen) fade = (total - i) / fadeLen;

    const noiseL = (Math.random() * 2 - 1) * 0.15;
    const noiseR = (Math.random() * 2 - 1) * 0.15;
    return [noiseL * fade, noiseR * fade];
  });
}

// 2. Brown Noise (deep integrated 1/f^2)
{
  let lastL = 0;
  let lastR = 0;
  createWavFile('brown-noise.wav', SAMPLE_RATE, LOOP_DURATION, (t, i, total) => {
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;
    lastL = (lastL + 0.02 * whiteL) / 1.02;
    lastR = (lastR + 0.02 * whiteR) / 1.02;
    return [lastL * 2.5, lastR * 2.5];
  });
}

// 3. Rain (filtered brown/pink with spatial droplets)
{
  let bL = 0, bR = 0;
  createWavFile('rain.wav', SAMPLE_RATE, LOOP_DURATION, (t, i, total) => {
    const wL = Math.random() * 2 - 1;
    const wR = Math.random() * 2 - 1;
    bL = (bL + 0.05 * wL) / 1.05;
    bR = (bR + 0.05 * wR) / 1.05;

    // Gentle rain swell modulation (slow wave)
    const swell = 0.8 + 0.2 * Math.sin((t / LOOP_DURATION) * Math.PI * 4);
    // Occasional droplets
    const droplet = (Math.random() > 0.998 ? (Math.random() * 2 - 1) * 0.2 : 0);

    return [(bL * 1.5 + droplet) * swell, (bR * 1.5 + droplet) * swell];
  });
}

// 4. Café (layered subtle ambient murmur drone & warm acoustics)
{
  let m1 = 0, m2 = 0;
  createWavFile('cafe.wav', SAMPLE_RATE, LOOP_DURATION, (t, i, total) => {
    const n1 = Math.random() * 2 - 1;
    const n2 = Math.random() * 2 - 1;
    m1 = (m1 + 0.015 * n1) / 1.015;
    m2 = (m2 + 0.015 * n2) / 1.015;

    // Distant acoustic resonance
    const hum = Math.sin(2 * Math.PI * 180 * t) * 0.02 + Math.sin(2 * Math.PI * 240 * t) * 0.015;
    const acousticMovement = Math.sin(t * 1.5) * 0.1;

    return [(m1 * 2.2 + hum) * (1 + acousticMovement), (m2 * 2.2 + hum) * (1 - acousticMovement)];
  });
}

// 5. Completion Bell (Tibetan singing bowl / pure gong with 5.0s exponential decay)
{
  const BELL_DURATION = 5.0;
  createWavFile('completion-bell.wav', SAMPLE_RATE, BELL_DURATION, (t, i, total) => {
    // Attack & exponential decay
    const attack = Math.min(1.0, t * 50); // fast 20ms attack
    const decay = Math.exp(-t * 0.9); // gentle 5s ring

    // Harmonics for Tibetan singing bowl: Fundamental 528 Hz + 1056 Hz + 1584 Hz + 2112 Hz
    const f0 = 528;
    const h1 = Math.sin(2 * Math.PI * f0 * t) * 0.5;
    const h2 = Math.sin(2 * Math.PI * (f0 * 2.01) * t) * 0.25;
    const h3 = Math.sin(2 * Math.PI * (f0 * 3.02) * t) * 0.12;
    const h4 = Math.sin(2 * Math.PI * (f0 * 4.04) * t) * 0.05;

    // Subtle stereo beating
    const stereoBeating = Math.sin(2 * Math.PI * 1.5 * t) * 0.1;

    const sample = (h1 + h2 + h3 + h4) * attack * decay * 0.8;
    return [sample * (1 + stereoBeating), sample * (1 - stereoBeating)];
  });
}

console.log('All ambient soundscapes & completion bell generated successfully.');
