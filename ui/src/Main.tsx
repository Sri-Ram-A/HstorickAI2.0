// src/remotion/HistoryVideo/Main.tsx

import React from "react";
import { Sequence } from "remotion";
import { VideoPlan, VideoScene } from "@/lib/schemas/videoSchemas";
import { SceneRenderer } from "./SceneRenderer";

export function Main(props: VideoPlan): React.ReactElement {
  const { topic , scenes } = props;
  let currentFrame = 0;
  const sceneSequences: React.ReactElement[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneDuration = 120//_frames per scene, can be dynamic based on content length or type;
    sceneSequences.push(
      <Sequence
        key={scene.sceneId}
        from={currentFrame}
        durationInFrames={sceneDuration}
      >
        <SceneRenderer scene={scene} />
      </Sequence>
    );
    currentFrame += sceneDuration;
  }
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {sceneSequences}
    </div>
  );
}