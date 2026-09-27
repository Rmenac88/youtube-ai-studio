import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene as SceneData } from "./types";

/**
 * Generic scene renderer: every scene on screen is produced by this one
 * component, parameterized by data. Do not fork this per-video — add fields
 * to the Scene type and branch on them here instead, so every scene stays
 * data-driven and regenerable from data/projects/<slug>/scenes.json.
 */
export const Scene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.background ?? "#0b0e14",
        justifyContent,
        alignItems: "center",
        padding: 96,
      }}
    >
      {scene.text ? (
        <div
          style={{
            opacity,
            transform,
            color: "#f5f6f8",
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 72,
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: -1,
          }}
        >
          {scene.text.content}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
