import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene } from "./Scene";
import { Captions } from "./Captions";
import type { VideoProject } from "./types";
import { TRANSITION_FRAMES } from "./constants";

/**
 * Sequences a VideoProject's scenes with a crossfade between each pair, and
 * overlays burned-in captions (if the project has any) across the whole
 * thing. This composition never changes per-video — only the data it's fed
 * (see Root.tsx / scenes.json) changes.
 */
export const DemoComposition: React.FC<{ project: VideoProject }> = ({
  project,
}) => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {project.scenes.map((scene, index) => (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence
              durationInFrames={Math.round(scene.duration * project.fps)}
            >
              <Scene scene={scene} />
            </TransitionSeries.Sequence>
            {index < project.scenes.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      {project.captions ? <Captions captions={project.captions} /> : null}
    </AbsoluteFill>
  );
};
