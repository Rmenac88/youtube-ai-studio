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

/**
 * Background media for a scene: webcam footage, an AI-generated image, or
 * stock footage/photo — all three are just a file dropped in assets/ and
 * referenced here. `src` is a path relative to the repo's assets/ folder
 * (e.g. "images/scene_004_bg.jpg" for assets/images/scene_004_bg.jpg),
 * never an absolute filesystem path.
 */
export type MediaConfig = {
  type: "image" | "video";
  src: string;
  /** Video only: mute the clip's own audio (e.g. b-roll under narration). */
  muted?: boolean;
};

export type Scene = {
  id: string;
  /** Duration of this scene, in seconds. */
  duration: number;
  /** Voiceover / narration line for this scene (also drives subtitles). */
  narration: string;
  text?: TextConfig;
  animation: AnimationConfig;
  /** Background media (image/video). Takes priority over `background`. */
  media?: MediaConfig;
  /** Flat background color, used when there's no media yet (e.g. this demo). */
  background?: string;
};

export type VideoProject = {
  id: string;
  fps: number;
  width: number;
  height: number;
  scenes: Scene[];
  /**
   * Burned-in subtitles for the whole video, timed in absolute
   * milliseconds from the start. Generated from a real voice recording by
   * scripts/generate-captions (Whisper) — never hand-written for a real
   * video, only for this demo project.
   */
  captions?: { text: string; startMs: number; endMs: number }[];
};
