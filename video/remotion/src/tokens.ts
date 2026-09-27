// Design tokens — the one place that encodes "what this channel looks
// like". Neutral/sober defaults for now (per audit decision, 2026-09-27):
// change these values when a real visual identity is chosen, rather than
// hunting for hardcoded colors across scene components.

export const colors = {
  backgroundDark: "#0b0e14",
  backgroundDarkAlt: "#11151f",
  text: "#f5f6f8",
  scrimStart: "rgba(0,0,0,0.65)",
  scrimEnd: "rgba(0,0,0,0)",
};

export const type = {
  fontFamily: "Inter",
  sizes: {
    title: 72,
    caption: 44,
  },
};

// Subtle, consistent grade applied over every scene's media so webcam,
// stock and AI-generated visuals don't look like three different sources
// cut together. Values are intentionally mild — a grade should be felt,
// not seen.
export const grade = {
  contrast: 1.05,
  saturate: 1.08,
  brightness: 0.98,
};

// Background music level relative to voice-over (0–1). Kept low and
// constant for now — real ducking (auto-lowering music under speech)
// needs waveform analysis and is deliberately left out until a real
// video shows it's actually needed (§20: no complexity without a need).
export const musicVolume = 0.12;
