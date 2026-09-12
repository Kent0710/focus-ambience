# Mono Focus — Project Context & Engineering Rules

> **Positioning**: *"The cleanest focus timer on Android. Free, forever."*  
> **Repository**: [https://github.com/Kent0710/focus-ambience.git](https://github.com/Kent0710/focus-ambience.git)

---

## 🚨 Mandatory Session Rules for AI Agents & Engineers

Every future development session and AI agent MUST adhere strictly to these operational guidelines:

### Rule 1: Git Branching & GitHub Push Workflow
- **Never commit directly to `main` for new features or major refactors.**
- Always branch off `main` with clear naming:
  - Features: `feat/<feature-name>` (e.g., `feat/custom-durations`)
  - Fixes: `fix/<bug-description>` (e.g., `fix/audio-loop-restart`)
  - Chores/Refactors: `chore/<description>` or `refactor/<description>`
- Commit atomically with conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `perf:`).
- Push branches and updates to GitHub (`origin <branch-name>`) progressively throughout the session.

### Rule 2: Verification Before Declaring Completion
- **Never claim a task is complete without inspecting the terminal and running verification.**
- Run the TypeScript compiler check:
  ```bash
  npx tsc --noEmit
  ```
- Review terminal logs for any warnings, bundle errors, or unhandled exceptions.
- Fix all errors and warnings before submitting or reporting back to the user.

---

## 🎨 Design Language & Aesthetic Constraints

1. **Pure Swiss / Braun Minimalist Architecture**:
   - 🚫 **NO Emojis**: Use crisp typography or clean vector marks.
   - 🚫 **NO Gradients**: 100% flat solid backgrounds (`#000000` in Dark Mode, `#FFFFFF` in Light Mode).
   - 🚫 **NO Backdrop Shadows / Blurs**: 1px sharp structural borders only.
   - 🌓 **Default Light & Dark Modes**: Seamless system-respecting or toggleable flat color palettes.
2. **Typography**: Tabular monospace numbers for countdown timers to eliminate layout jitter.
3. **Soundscapes**: Integrated, 5 options max (Rain, White Noise, Brown Noise, Café, Silence) with 1.5s exponential fading and harmonic completion chime.

---

## 🏗️ Codebase Structure (Meta SWE Standard)

```
frontend/
├── assets/
│   └── audio/                       # 16-bit PCM offline audio loops & chime
│       ├── rain.wav
│       ├── white-noise.wav
│       ├── brown-noise.wav
│       ├── cafe.wav
│       └── completion-bell.wav
└── src/
    ├── core/                        # Low-level primitives & design tokens
    │   ├── theme/
    │   │   ├── colors.ts            # Flat dark (#000000) & light (#FFFFFF)
    │   │   ├── typography.ts        # Tabular mono fonts
    │   │   └── ThemeContext.tsx     # Theme provider
    │   ├── constants/config.ts      # Duration limits, audio fade curves
    │   └── haptics/HapticEngine.ts  # Throttled tactile feedback
    │
    ├── features/                    # Domain feature slices
    │   ├── timer/                   # Focus timer engine, gestures & state
    │   │   ├── components/CountdownDisplay.tsx
    │   │   ├── components/TimerProgressBar.tsx
    │   │   ├── state/TimerContext.tsx
    │   │   └── types.ts
    │   ├── ambient/                 # Audio engine, sound presets & picker
    │   │   ├── engine/AudioEngine.ts
    │   │   ├── components/SoundPickerPill.tsx
    │   │   ├── state/AmbientContext.tsx
    │   │   └── presets.ts
    │   └── session-log/             # Daily completion logs & dot indicators
    │       ├── components/DailySessionDots.tsx
    │       ├── storage/SessionRepository.ts
    │       └── types.ts
    │
    ├── platform/
    │   └── keep-awake/useOledDeskMode.ts
    ├── shared/
    │   ├── components/TopHeader.tsx
    │   └── utils/formatTime.ts
    └── app/
        ├── _layout.tsx              # Provider tree & gesture root
        └── index.tsx                # Single-screen focus experience
```

---

## 🛠️ Quick Commands

```bash
# Run TypeScript type check
npx tsc --noEmit

# Start Expo dev server
npm run start

# Regenerate procedural audio loops if needed
node scripts/generate-audio.js
```
