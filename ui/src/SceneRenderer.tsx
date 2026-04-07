import React, { Suspense, useMemo } from "react";
import { templateRegistry } from "@/lib/templates/TemplateRegistry";

export function SceneRenderer({ scene }: { scene: any }) {
  const loader = templateRegistry.getTemplateLoader(scene.templateName);
  const LazyComponent = useMemo(() => {
    if (!loader) return null;
    return React.lazy(loader);
  }, [loader]); // 🔥 critical
  if (!LazyComponent) {
    return (
      <div style={{ backgroundColor: "red", color: "white", padding: 20 }}>
        Error: Template "{scene.templateName}" not found
      </div>
    );
  }
  return (
    <Suspense fallback={<div />}>
      <LazyComponent {...scene.params} />
    </Suspense>
  );
}