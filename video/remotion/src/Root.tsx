import React from "react";
import { Composition } from "remotion";
import { DemoComposition } from "./DemoComposition";
import demoProject from "../../../data/projects/demo/scenes.json";
import dangersNationalismeProject from "../../../data/projects/dangers-nationalisme/scenes.json";
import type { VideoProject } from "./types";
import { TRANSITION_FRAMES } from "./constants";

// TransitionSeries overlaps each pair of scenes by the transition length,
// so the total is shorter than the sum of scene durations by (number of
// transitions × their length).
const durationInFrames = (project: VideoProject) => {
  const raw = Math.round(
    project.scenes.reduce((sum, s) => sum + s.duration, 0) * project.fps
  );
  return raw - TRANSITION_FRAMES * Math.max(0, project.scenes.length - 1);
};

// Every video is one Composition here: an id, its scenes.json cast to
// VideoProject, and nothing else — the content lives entirely in
// data/projects/<slug>/scenes.json, never hardcoded per-video in this file.
const projects: { id: string; project: VideoProject }[] = [
  { id: "DemoScene", project: demoProject as VideoProject },
  {
    id: "DangersNationalisme",
    project: dangersNationalismeProject as VideoProject,
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {projects.map(({ id, project }) => (
        <Composition
          key={id}
          id={id}
          component={DemoComposition}
          durationInFrames={durationInFrames(project)}
          fps={project.fps}
          width={project.width}
          height={project.height}
          defaultProps={{ project }}
        />
      ))}
    </>
  );
};
