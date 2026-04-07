// src/components/templates/IntroductionFrame.tsx
import React from 'react';
import { Sequence, useCurrentFrame, interpolate } from 'remotion';
import { BaseTemplate } from '@/lib/templates/BaseTemplate';
import { IntroductionSceneSchema } from "@/lib/schemas/videoSchemas";
import { z } from 'zod';
interface IntroductionFrameProps {
  title: string;
  subtitle?: string;
  era?: string;
  mood?: "serious" | "dramatic" | "educational";
}

export default function IntroductionFrame(props: z.infer<typeof IntroductionSceneSchema.shape.params>): React.ReactElement {
  const frame = useCurrentFrame();
  
  // Different colors based on mood
  let backgroundColor = '#1a1a2e';
  let accentColor = '#c4a747';
  let titleColor = '#ffffff';
  
  if (props.mood === "serious") {
    backgroundColor = '#2c3e50';
    accentColor = '#95a5a6';
  } else if (props.mood === "dramatic") {
    backgroundColor = '#8b0000';
    accentColor = '#ffd700';
  } else if (props.mood === "educational") {
    backgroundColor = '#1a472a';
    accentColor = '#d4af37';
  }
  
  // Animate title (zoom in)
  const titleScale = interpolate(frame, [0, 30], [0.5, 1], {
    extrapolateRight: 'clamp',
  });
  
  // Animate subtitle (fade in, delayed)
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  // Animate era text (slide up)
  const eraYPosition = interpolate(frame, [40, 70], [50, 0], {
    extrapolateRight: 'clamp',
  });
  
  const titleStyle: React.CSSProperties = {
    fontSize: '72px',
    fontWeight: 'bold',
    color: titleColor,
    textAlign: 'center',
    marginBottom: '20px',
    transform: `scale(${titleScale})`,
    textShadow: `2px 2px 4px ${accentColor}`,
  };
  
  const subtitleStyle: React.CSSProperties = {
    fontSize: '32px',
    color: accentColor,
    textAlign: 'center',
    opacity: subtitleOpacity,
    marginBottom: '15px',
  };
  
  const eraStyle: React.CSSProperties = {
    fontSize: '24px',
    color: '#cccccc',
    textAlign: 'center',
    transform: `translateY(${eraYPosition}px)`,
    opacity: subtitleOpacity,
  };
  
  return (
    <BaseTemplate backgroundColor={backgroundColor} animationType="fade">
      <h1 style={titleStyle}>{props.title}</h1>
      
      {props.subtitle && (
        <p style={subtitleStyle}>{props.subtitle}</p>
      )}
      
      {props.era && (
        <p style={eraStyle}>{props.era}</p>
      )}
      
      {/* Decorative line that animates in */}
      <Sequence from={30}>
        <div style={{
          width: interpolate(frame, [30, 60], [0, 200]),
          height: '3px',
          backgroundColor: accentColor,
          marginTop: '30px',
        }} />
      </Sequence>
    </BaseTemplate>
  );
}