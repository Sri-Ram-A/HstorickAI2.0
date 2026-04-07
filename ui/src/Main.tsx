// src/remotion/HistoryVideo/Main.tsx
import React from 'react';
import { Sequence, Series } from 'remotion';
import { VideoPlan, VideoScene } from '@/lib/schemas/videoSchemas';
import { templateRegistry } from '@/lib/templates/TemplateRegistry';
import { IntroductionFrame } from '@/components/templates/IntroductionFrame';

interface MainProps {
  videoPlan: VideoPlan;
}

export function Main(props: MainProps): React.ReactElement {
  const { videoPlan } = props;
  
  // Helper function to render a scene based on its template
  function renderScene(scene: VideoScene): React.ReactElement {
    const TemplateComponent = templateRegistry.getTemplateComponent(scene.templateName);
    
    if (!TemplateComponent) {
      return (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '20px' }}>
          Error: Template "{scene.templateName}" not found
        </div>
      );
    }
    
    // Pass the params to the template component
    return <TemplateComponent {...scene.params} />;
  }
  
  // Calculate running total of frames for sequencing
  let currentFrame = 0;
  const sceneSequences: React.ReactElement[] = [];
  
  for (let i = 0; i < videoPlan.scenes.length; i++) {
    const scene = videoPlan.scenes[i];
    const sceneDuration = scene.durationInFrames;
    
    sceneSequences.push(
      <Sequence
        key={scene.sceneId}
        from={currentFrame}
        durationInFrames={sceneDuration}
      >
        {renderScene(scene)}
      </Sequence>
    );
    
    currentFrame += sceneDuration;
  }
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {sceneSequences}
    </div>
  );
}