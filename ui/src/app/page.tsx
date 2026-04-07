"use client";

import * as React from "react";
import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useMemo, useState, useEffect, useCallback } from "react";
import { z } from "zod";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/types/constants";
import { RenderControls } from "@/components/remotion/RenderControls";
import { Main } from "../Main";
import { useTheme } from "next-themes";
import { VideoOrchestrator } from "@/lib/orchestrator/VideoOrchestrator";
import { VideoPlan, VideoPlanSchema } from "@/lib/schemas/videoSchemas";

// Extended props that include the video plan
interface ExtendedCompositionProps extends z.infer<typeof CompositionProps> {
  videoPlan: VideoPlan | null;
}

const Home: NextPage = () => {
  // State for text input
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  
  // State for video generation
  const [videoPlan, setVideoPlan] = useState<VideoPlan | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Theme management
  const { setTheme, theme } = useTheme();
  
  // Initialize orchestrator
  const orchestrator = useMemo(() => new VideoOrchestrator(), []);

  // Function to generate video from user prompt
  const generateVideoFromPrompt = useCallback(async (prompt: string): Promise<void> => {
    // Reset states
    setIsGeneratingVideo(true);
    setGenerationError(null);
    
    try {
      console.log("Generating video for prompt:", prompt);
      const plan = await orchestrator.generateVideoPlan(prompt);
      
      // Validate the plan before setting it
      const validationResult = VideoPlanSchema.safeParse(plan);
      if (!validationResult.success) {
        throw new Error(`Invalid video plan generated: ${validationResult.error.message}`);
      }
      
      setVideoPlan(plan);
      console.log("Video generated successfully:", plan);
    } catch (error) {
      console.error("Failed to generate video:", error);
      setGenerationError(error instanceof Error ? error.message : "Unknown error occurred");
      setVideoPlan(null);
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [orchestrator]);

  // Generate initial video when component mounts
  useEffect(() => {
    generateVideoFromPrompt(text);
  }, []); // Empty dependency array means run once on mount

  // Handle text input change and regenerate
  const handleTextChange = (newText: string): void => {
    setText(newText);
  };

  const handleRegenerateVideo = (): void => {
    if (text.trim()) {
      generateVideoFromPrompt(text);
    }
  };

  // Prepare input props for the player
  const inputProps = useMemo(() => {
    return {
      title: text,
      videoPlan: videoPlan,
    };
  }, [text, videoPlan]);

  // Determine if player should be visible
  const showPlayer = videoPlan !== null && !isGeneratingVideo;
  const showLoading = isGeneratingVideo;
  const showError = generationError !== null && !isGeneratingVideo;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI History Video Generator
          </h1>
          <p className="text-muted-foreground">
            Create engaging historical videos about World War 1
          </p>
        </header>

        {/* Theme Selection */}
        <section className="mb-6 flex items-center justify-end gap-3">
          <label htmlFor="theme" className="text-sm font-medium text-foreground">
            App Theme:
          </label>
          <select
            id="theme"
            name="theme"
            value={theme ?? "system"}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
            <option value="zen-light">Zen Light</option>
            <option value="zen-dark">Zen Dark</option>
          </select>
        </section>

        {/* Input Section */}
        <section className="mb-6">
          <label htmlFor="video-topic" className="block text-sm font-medium text-foreground mb-2">
            What historical topic would you like to learn about?
          </label>
          <div className="flex gap-3">
            <input
              id="video-topic"
              type="text"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="e.g., The Rise of World War 1, Causes of WWI, The Western Front..."
              className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleRegenerateVideo}
              disabled={isGeneratingVideo || !text.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingVideo ? "Generating..." : "Generate Video"}
            </button>
          </div>
        </section>

        {/* Video Player Section */}
        <section className="mb-6">
          <div className="overflow-hidden rounded-lg shadow-xl bg-card">
            {/* Loading State */}
            {showLoading && (
              <div 
                className="w-full flex flex-col items-center justify-center"
                style={{ 
                  aspectRatio: `${VIDEO_WIDTH}/${VIDEO_HEIGHT}`,
                  minHeight: '400px'
                }}
              >
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                  <p className="text-foreground font-medium">Generating your history video...</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    AI is creating scenes based on World War 1 history
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {showError && (
              <div 
                className="w-full flex flex-col items-center justify-center bg-destructive/10"
                style={{ 
                  aspectRatio: `${VIDEO_WIDTH}/${VIDEO_HEIGHT}`,
                  minHeight: '400px'
                }}
              >
                <div className="text-center p-8">
                  <div className="text-destructive text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Failed to Generate Video
                  </h3>
                  <p className="text-muted-foreground mb-4">{generationError}</p>
                  <button
                    onClick={handleRegenerateVideo}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Player State */}
            {showPlayer && videoPlan && (
              <Player
                component={Main as any}
                inputProps={inputProps}
                durationInFrames={videoPlan.totalDurationInFrames || DURATION_IN_FRAMES}
                fps={VIDEO_FPS}
                compositionHeight={VIDEO_HEIGHT}
                compositionWidth={VIDEO_WIDTH}
                style={{ width: "100%", aspectRatio: `${VIDEO_WIDTH}/${VIDEO_HEIGHT}` }}
                controls
                autoPlay
                loop={false}
              />
            )}

            {/* No Plan State (should not happen normally) */}
            {!showPlayer && !showLoading && !showError && (
              <div 
                className="w-full flex items-center justify-center bg-muted"
                style={{ 
                  aspectRatio: `${VIDEO_WIDTH}/${VIDEO_HEIGHT}`,
                  minHeight: '400px'
                }}
              >
                <p className="text-muted-foreground">Enter a topic and click Generate to start</p>
              </div>
            )}
          </div>
        </section>

        {/* Video Information Panel */}
        {videoPlan && !isGeneratingVideo && (
          <section className="mt-6 p-4 rounded-lg bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-2">Video Information</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Topic:</span> {videoPlan.topic}</p>
              <p><span className="font-medium">Total Duration:</span> {(videoPlan.totalDurationInFrames / VIDEO_FPS).toFixed(1)} seconds</p>
              <p><span className="font-medium">Number of Scenes:</span> {videoPlan.scenes.length}</p>
              {videoPlan.metadata?.generatedAt && (
                <p><span className="font-medium">Generated:</span> {new Date(videoPlan.metadata.generatedAt).toLocaleString()}</p>
              )}
            </div>
          </section>
        )}

        {/* Render Controls (commented out but can be enabled for debugging) */}
        {/* <section className="flex flex-col gap-4 mt-6">
          <RenderControls
            text={text}
            setText={setText}
            inputProps={inputProps}
          />
        </section> */}
      </div>
    </div>
  );
};

export default Home;