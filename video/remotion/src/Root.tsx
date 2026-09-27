import React from "react";
import { Composition } from "remotion";
import { DemoComposition } from "./DemoComposition";
import demoProject from "../../../data/projects/demo/scenes.json";
import type { VideoProject } from "./types";

const project = demoProject as VideoProject;
const totalDurationInFrames = Math.round(
  project.scenes.reduce((sum, s) => sum + s.duration, 0) * project.fps
);

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
