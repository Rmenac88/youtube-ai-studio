// Crossfade length between consecutive scenes, in frames. Shared between
// DemoComposition (which applies the transition) and Root (which must
// account for the overlap when computing total duration) — kept in one
// place so the two never drift out of sync.
export const TRANSITION_FRAMES = 12;
