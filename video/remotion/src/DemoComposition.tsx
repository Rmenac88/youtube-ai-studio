import React from "react";
import { Series } from "remotion";
import { Scene } from "./Scene";
import type { VideoProject } from "./types";

/**
 * Sequences a VideoProject's scenes back to back. This composition never
 * changes per-video — only the data it's fed (see Root.tsx / scenes.json)
 * changes. That's the whole point of the data-driven approach in the audit
 * (§10): editing text, timing, or colors means editing JSON, not this file.
 */
export const DemoComposition: React.FC<{ project: VideoProject }> = ({
  project,
}) => {
  return (
    <Series>
      {project.scenes.map((scene) => (
        <Series.Sequence
          key={scene.id}
          durationInFrames={Math.round(scene.duration * project.fps)}
        >
          <Scene scene={scene} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
