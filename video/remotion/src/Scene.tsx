import React from "react";
import {
  AbsoluteFill,
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
    <AbsoluteFill style={{ backgroundColor: scene.background ?? "#0b0e14" }}>
      {scene.media?.type === "image" ? (
        <Img
          src={staticFile(scene.media.src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : scene.media?.type === "video" ? (
        <OffthreadVideo
          src={staticFile(scene.media.src)}
          muted={scene.media.muted ?? false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {/* Scrim: keeps text legible over media without hiding it entirely —
          only rendered when there's media behind the text (§11: sober, not
          a flat block of color over the shot). */}
      {scene.media && scene.text ? (
        <AbsoluteFill
          style={{
            background:
              scene.text.position === "lower-third"
                ? "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0) 45%)"
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
              color: "#f5f6f8",
              fontFamily,
              fontSize: 72,
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
    </AbsoluteFill>
  );
};
