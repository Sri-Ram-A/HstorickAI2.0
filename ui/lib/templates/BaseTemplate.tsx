// lib/templates/BaseTemplate.tsx
// Purpose: A phonebook that maps template names (like "introduction") 
// to actual React components.
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
// Purpose: A parent component that all other templates inherit from. 
// Provides common animations and styling.
interface BaseTemplateProps {
  children: React.ReactNode;
  backgroundColor?: string;
  animationType?: "fade" | "slide" | "zoom";
}

export function BaseTemplate(props: BaseTemplateProps): React.ReactElement {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Calculate opacity based on frame (fade in for first 30 frames)
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Choose animation style
  let transformValue = 'none';
  
  if (props.animationType === "slide") {
    const slideAmount = interpolate(frame, [0, 30], [100, 0]);
    transformValue = `translateX(${slideAmount}px)`;
  } else if (props.animationType === "zoom") {
    const zoomAmount = interpolate(frame, [0, 30], [0.8, 1]);
    transformValue = `scale(${zoomAmount})`;
  }
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: props.backgroundColor || '#1a1a2e',
    opacity: opacity,
    transform: transformValue,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };
  
  return (
    <div style={containerStyle}>
      {props.children}
    </div>
  );
}