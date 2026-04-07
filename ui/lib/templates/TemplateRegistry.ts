// lib/templates/TemplateRegistry.ts

type TemplateLoader = () => Promise<{ default: React.ComponentType<any> }>;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class TemplateRegistry {
  private templates: Map<string, TemplateLoader>;

  constructor() {
    this.templates = new Map();
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Register templates with dynamic imports
    const templateNames = ["introduction",];
    templateNames.forEach((name) => {
      this.templates.set(name, () =>
        import(`@/components/templates/${capitalize(name)}Frame`)
      );
    });
  }

  // Returns the loader (not component)
  public getTemplateLoader(templateName: string): TemplateLoader | undefined {
    return this.templates.get(templateName);
  }

  // Async: resolves actual component
  public async getTemplateComponent(
    templateName: string
  ): Promise<React.ComponentType<any> | undefined> {
    const loader = this.templates.get(templateName);
    if (!loader) return undefined;
    const mod = await loader();
    return mod.default;
  }

  public getAllTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }
}

// Singleton
export const templateRegistry = new TemplateRegistry();

//// How to use in any file ?
// const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null);
// React.useEffect(() => {
//   const load = async () => {
//     const comp = await templateRegistry.getTemplateComponent("introduction");
//     if (comp) setComponent(() => comp);
//   };
//   load();
// }, []);
// return Component ? <Component /> : <div>Loading...</div>;