import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoProject } from "./types";
import { fontFamily } from "./fonts";

type CaptionEntry = NonNullable<VideoProject["captions"]>[number];

/**
 * Burned-in subtitles for the whole composition, driven by a flat list of
 * timed captions (see scripts/generate-captions — produces exactly this
 * shape from a real voice recording via Whisper). Timestamps are absolute,
 * in milliseconds, from the start of the video.
 */
export const Captions: React.FC<{ captions: CaptionEntry[] }> = ({
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;

  const active = captions.find(
    (c) => timeMs >= c.startMs && timeMs < c.endMs
  );

  if (!active) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 140,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 44,
          fontWeight: 600,
          color: "#ffffff",
          textAlign: "center",
          maxWidth: "80%",
          padding: "10px 24px",
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
