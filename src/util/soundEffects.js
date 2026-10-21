// Warframe UI Sound Synthesizer via Web Audio API
const SOUND_STORAGE_KEY = "loid-exchange:sound-enabled:v1";

function loadSoundPreference() {
  if (typeof window === "undefined") return true;
  try {
    const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
}

function persistSoundPreference(enabled) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(enabled));
  } catch {
    // Keep in memory if local storage is blocked
  }
}

let audioCtx = null;
let soundEnabled = loadSoundPreference();

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  persistSoundPreference(soundEnabled);
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

// Futuristic high-tech Warframe UI Click
export const playUiClick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const play = () => {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      } catch {
        // Safe fail
      }
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  } catch {
    // Audio might be blocked before user interaction
  }
};

// Scan chime for Void Scan
export const playScanChime = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const play = () => {
      try {
        const now = ctx.currentTime;
        [440, 660, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.03, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + idx * 0.08 + 0.2,
          );

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.2);
        });
      } catch {
        // Safe fail
      }
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  } catch {
    // Audio blocked
  }
};
