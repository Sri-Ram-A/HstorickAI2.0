// src/lib/orchestrator/VideoOrchestrator.ts
import { VideoPlan, VideoPlanSchema } from '@/lib/schemas/videoSchemas';
import { templateRegistry } from '@/lib/templates/TemplateRegistry';

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
      return this.createDefaultPlan(userPrompt); // Fallback to a default plan
    }
    // Step 3. Return the validated plan
    this.videoPlan = validationResult.data;
    return validationResult.data;
  }

  private async callAIToCreateScenes(prompt: string): Promise<any> {
    // For now, return a hardcoded WW1 example
    return {
      topic: "World War 1",
      scenes: [
        {
          sceneId : "scene1",
          templateName: "introduction",
          params: {
            title: "The Great War",
            subtitle: "World War I (1914-1918)",
            era: "The War to End All Wars",
            mood: "dramatic"
          }
        },
        {
          sceneId : "scene2",
          templateName: "timeline",
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
          sceneId : "scene3",
          templateName: "map",
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
          sceneId : "scene4",
          templateName: "newspaper",
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
      scenes: [
        {
          sceneId: "default-intro",
          templateName: "introduction",
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

  public calculateTotalDuration(scenes:any): number {
    return 20;
  }
}