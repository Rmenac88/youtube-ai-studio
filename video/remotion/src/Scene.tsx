import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene as SceneData } from "./types";
import { fontFamily } from "./fonts";
import { colors, grade, type as typeTokens } from "./tokens";

/**
 * Generic scene renderer: every scene on screen is produced by this one
 * component, parameterized by data. Do not fork this per-video — add fields
 * to the Scene type and branch on them here instead, so every scene stays
 * data-driven and regenerable from data/projects/<slug>/scenes.json.
 */
export const Scene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entranceFrames = scene.animation.durationInFrames ?? 20;

  const progress = spring({
    frame,
    fps,
    durationInFrames: entranceFrames,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  let transform = "none";

  if (scene.animation.type === "fade-scale") {
    const scale = interpolate(progress, [0, 1], [0.92, 1]);
    transform = `scale(${scale})`;
  } else if (scene.animation.type === "slide-up") {
    const translateY = interpolate(progress, [0, 1], [40, 0]);
    transform = `translateY(${translateY}px)`;
  }

  const justifyContent =
    scene.text?.position === "top"
      ? "flex-start"
      : scene.text?.position === "lower-third"
      ? "flex-end"
      : "center";

  // Ken Burns: a slow, constant zoom across the whole scene — independent
  // of the text entrance animation above, which only covers the first
  // `entranceFrames` frames. Defaults to a gentle zoom-in for images
  // (most common), off for video (already has its own motion).
  const kenBurns = scene.media?.type === "image" ? scene.media.kenBurns ?? "in" : "none";
  const kenBurnsScale =
    kenBurns === "none"
      ? 1
      : interpolate(
          frame,
          [0, durationInFrames],
          kenBurns === "in" ? [1, 1.08] : [1.08, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  return (
    <AbsoluteFill style={{ backgroundColor: scene.background ?? colors.backgroundDark }}>
      {scene.media ? (
        <AbsoluteFill
          style={{
            // Unifying grade so webcam / stock / AI images don't look like
            // three different sources cut together (§ audit: étalonnage).
            filter: `contrast(${grade.contrast}) saturate(${grade.saturate}) brightness(${grade.brightness})`,
            transform: `scale(${kenBurnsScale})`,
          }}
        >
          {scene.media.type === "image" ? (
            <Img
              src={staticFile(scene.media.src)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <OffthreadVideo
              src={staticFile(scene.media.src)}
              muted={scene.media.muted ?? false}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </AbsoluteFill>
      ) : null}

      {/* Scrim: keeps text legible over media without hiding it entirely —
          only rendered when there's media behind the text (§11: sober, not
          a flat block of color over the shot). */}
      {scene.media && scene.text ? (
        <AbsoluteFill
          style={{
            background:
              scene.text.position === "lower-third"
                ? `linear-gradient(to top, ${colors.scrimStart}, ${colors.scrimEnd} 45%)`
                : "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.35))",
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{ justifyContent, alignItems: "center", padding: 96 }}
      >
        {scene.text ? (
          <div
            style={{
              opacity,
              transform,
              color: colors.text,
              fontFamily,
              fontSize: typeTokens.sizes.title,
              fontWeight: 600,
              textAlign: "center",
              letterSpacing: -1,
              textShadow: scene.media ? "0 2px 24px rgba(0,0,0,0.5)" : "none",
            }}
          >
            {scene.text.content}
          </div>
        ) : null}
      </AbsoluteFill>

      {scene.voiceover ? (
        <Audio
          src={staticFile(scene.voiceover.src)}
          volume={scene.voiceover.volume ?? 1}
        />
      ) : null}
    </AbsoluteFill>
  );
};
