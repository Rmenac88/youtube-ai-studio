import React from "react";
import { Composition } from "remotion";
import { DemoComposition } from "./DemoComposition";
import demoProject from "../../../data/projects/demo/scenes.json";
import type { VideoProject } from "./types";
import { TRANSITION_FRAMES } from "./constants";

const project = demoProject as VideoProject;

// TransitionSeries overlaps each pair of scenes by the transition length,
// so the total is shorter than the sum of scene durations by (number of
// transitions × their length).
const rawDurationInFrames = Math.round(
  project.scenes.reduce((sum, s) => sum + s.duration, 0) * project.fps
);
const totalDurationInFrames =
  rawDurationInFrames - TRANSITION_FRAMES * Math.max(0, project.scenes.length - 1);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DemoScene"
      component={DemoComposition}
      durationInFrames={totalDurationInFrames}
      fps={project.fps}
      width={project.width}
      height={project.height}
      defaultProps={{ project }}
    />
  );
};
