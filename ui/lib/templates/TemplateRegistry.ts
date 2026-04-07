// src/lib/templates/TemplateRegistry.ts
import { Composition } from 'remotion';
import { VideoScene } from '../schemas/videoSchemas';

// Import your template components (we'll create these next)
import { IntroductionFrame } from "@/components/templates/IntroductionFrame";
// import { TimelineFrame } from '../../components/templates/TimelineFrame';
// import { MapFrame } from '../../components/templates/MapFrame';
// import { NewspaperFrame } from '../../components/templates/NewspaperFrame';

// Define what a template looks like in the registry
export interface TemplateDefinition {
  component: React.ComponentType<any>;
  schema: any; // Zod schema for validation
  defaultDuration: number;
  description: string;
}

// Create the registry mapping template names to their components
export class TemplateRegistry {
  private templates: Map<string, TemplateDefinition>;
  
  constructor() {
    this.templates = new Map();
    this.initializeTemplates();
  }
  
  private initializeTemplates(): void {
    // Register each template type
    this.templates.set("introduction", {
      component: IntroductionFrame,
      schema: null, // We'll link schema later
      defaultDuration: 180, // 6 seconds at 30fps
      description: "Opening scene with title and historical context",
    });
    
    // this.templates.set("timeline", {
    //   component: TimelineFrame,
    //   schema: null,
    //   defaultDuration: 300, // 10 seconds
    //   description: "Chronological display of key events",
    // });
    
    // this.templates.set("map", {
    //   component: MapFrame,
    //   schema: null,
    //   defaultDuration: 240, // 8 seconds
    //   description: "Geographical visualization with location markers",
    // });
    
    // this.templates.set("newspaper", {
    //   component: NewspaperFrame,
    //   schema: null,
    //   defaultDuration: 180, // 6 seconds
    //   description: "Historical newspaper headline style",
    // });
  }
  
  public getTemplate(templateName: string): TemplateDefinition | undefined {
    return this.templates.get(templateName);
  }
  
  public getAllTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }
  
  public getTemplateComponent(templateName: string): React.ComponentType<any> | undefined {
    const template = this.templates.get(templateName);
    return template ? template.component : undefined;
  }
}

// Create a singleton instance
export const templateRegistry = new TemplateRegistry();