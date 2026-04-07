// src/lib/orchestrator/VideoOrchestrator.ts
import { VideoPlan, VideoPlanSchema, VideoScene } from '../schemas/videoSchemas';
import { templateRegistry } from '../templates/TemplateRegistry';

export class VideoOrchestrator {
  private videoPlan: VideoPlan | null = null;
  
  constructor() {
    // Constructor can initialize any services needed
  }
  
  // Main function to generate a video plan from user input
  public async generateVideoPlan(userPrompt: string): Promise<VideoPlan> {
    // Step 1: Call AI to create scene structure
    const aiResponse = await this.callAIToCreateScenes(userPrompt);
    
    // Step 2: Validate the AI response with Zod
    const validationResult = VideoPlanSchema.safeParse(aiResponse);
    
    if (!validationResult.success) {
      console.error("AI returned invalid plan:", validationResult.error);
      // Fallback to a default plan
      return this.createDefaultPlan(userPrompt);
    }
    
    // Step 3: Validate that all requested templates exist
    const validatedPlan = validationResult.data;
    for (const scene of validatedPlan.scenes) {
      const templateExists = templateRegistry.getTemplate(scene.templateName);
      if (!templateExists) {
        throw new Error(`Template "${scene.templateName}" not found in registry`);
      }
    }
    
    this.videoPlan = validatedPlan;
    return validatedPlan;
  }
  
  private async callAIToCreateScenes(prompt: string): Promise<any> {
    // This will call OpenAI or Claude
    // For now, return a hardcoded WW1 example
    return {
      topic: "World War 1",
      totalDurationInFrames: 900, // 30 seconds
      scenes: [
        {
          sceneId: "scene-1",
          templateName: "introduction",
          durationInFrames: 180,
          params: {
            title: "The Great War",
            subtitle: "World War I (1914-1918)",
            era: "The War to End All Wars",
            mood: "dramatic"
          }
        },
        {
          sceneId: "scene-2",
          templateName: "timeline",
          durationInFrames: 300,
          params: {
            title: "Key Events",
            events: [
              { year: 1914, description: "Archduke Franz Ferdinand assassinated", isKeyEvent: true },
              { year: 1915, description: "Italy joins Allies", isKeyEvent: false },
              { year: 1917, description: "USA enters war", isKeyEvent: true },
              { year: 1918, description: "Armistice signed", isKeyEvent: true }
            ],
            orientation: "horizontal"
          }
        },
        {
          sceneId: "scene-3",
          templateName: "map",
          durationInFrames: 240,
          params: {
            region: "Europe",
            locations: [
              { name: "Sarajevo", coordinates: [43.8563, 18.4131], year: 1914 },
              { name: "Verdun", coordinates: [49.1599, 5.3829], year: 1916 },
              { name: "Somme", coordinates: [50.032, 2.698], year: 1916 }
            ],
            showTroopMovements: true,
            animationType: "pulse"
          }
        },
        {
          sceneId: "scene-4",
          templateName: "newspaper",
          durationInFrames: 180,
          params: {
            headline: "WAR DECLARED!",
            date: "August 4, 1914",
            source: "The Times",
            articleSnippet: "Germany has declared war on France, violating Belgian neutrality..."
          }
        }
      ]
    };
  }
  
  private createDefaultPlan(userPrompt: string): VideoPlan {
    // Fallback plan when AI fails
    return {
      topic: userPrompt,
      totalDurationInFrames: 360,
      scenes: [
        {
          sceneId: crypto.randomUUID(),
          templateName: "introduction",
          durationInFrames: 180,
          params: {
            title: userPrompt,
            subtitle: "A historical overview",
            mood: "educational"
          }
        }
      ]
    };
  }
  
  public getVideoPlan(): VideoPlan | null {
    return this.videoPlan;
  }
  
  public calculateTotalDuration(scenes: VideoScene[]): number {
    return scenes.reduce((total, scene) => total + scene.durationInFrames, 0);
  }
}