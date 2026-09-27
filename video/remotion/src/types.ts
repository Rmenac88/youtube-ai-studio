/**
 * Data-driven video contract.
 *
 * A video is described entirely by a `Scene[]` (see
 * data/projects/<slug>/scenes.json). Remotion turns that data into pixels —
 * no scene here should ever hardcode content that belongs in the data file.
 */

export type TextConfig = {
  /** What appears on screen (kinetic typography / lower third / title). */
  content: string;
  /** Where the text block sits. Keep this small and named, not free-form CSS. */
  position?: "center" | "lower-third" | "top";
};

export type AnimationConfig = {
  /** Named animation preset applied to the scene's entrance. */
  type: "fade" | "fade-scale" | "slide-up";
  /** Duration of the entrance animation, in frames. */
  durationInFrames?: number;
};

export type Scene = {
  id: string;
  /** Duration of this scene, in seconds. */
  duration: number;
  /** Voiceover / narration line for this scene (also drives subtitles). */
  narration: string;
  text?: TextConfig;
  animation: AnimationConfig;
  /** Background color while no real background asset pipeline exists yet. */
  background?: string;
};

export type VideoProject = {
  id: string;
  fps: number;
  width: number;
  height: number;
  scenes: Scene[];
};
