// lib/schemas/videoSchemas.ts
// Purpose: Defines the "rules" for what valid video data looks like.
import { z } from 'zod';

// Base schema that all video scenes must have
export const BaseSceneSchema = z.object({
    sceneId: z.string(), // Unique identifier for each scene
    templateName: z.string(),
    // Params can be any shape, but must be an object
    params: z.record(z.string(), z.any()),
});

// Schema for Introduction type scenes
export const IntroductionSceneSchema = BaseSceneSchema.extend({
    templateName: z.literal("introduction"),
    params: z.object({
        title: z.string().min(1).max(100),
        subtitle: z.string().optional(),
        era: z.string().optional(),
        mood: z.enum(["serious", "dramatic", "educational"]).default("educational"),
    }),
});

// Schema for Timeline scenes (WW1 events)
export const TimelineSceneSchema = BaseSceneSchema.extend({
    templateName: z.literal("timeline"),
    params: z.object({
        title: z.string(),
        events: z.array(z.object({
            year: z.number().int(),
            description: z.string(),
            isKeyEvent: z.boolean().default(false),
        })),
        orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
    }),
});

// Schema for Map scenes (geographical movements)
export const MapSceneSchema = BaseSceneSchema.extend({
    templateName: z.literal("map"),
    params: z.object({
        region: z.string(),
        locations: z.array(z.object({
            name: z.string(),
            coordinates: z.tuple([z.number(), z.number()]), // [latitude, longitude]
            year: z.number().optional(),
        })),
        showTroopMovements: z.boolean().default(false),
        animationType: z.enum(["fade", "pulse", "path"]).default("pulse"),
    }),
});

// Schema for Newspaper scenes (historical headlines)
export const NewspaperSceneSchema = BaseSceneSchema.extend({
    templateName: z.literal("newspaper"),
    params: z.object({
        headline: z.string().min(5).max(200),
        date: z.string(),
        source: z.string().optional(),
        articleSnippet: z.string().optional(),
        imageUrl: z.string().url().optional(),
    }),
});

export const VideoSceneSchema = z.discriminatedUnion("templateName", [
    IntroductionSceneSchema,
    TimelineSceneSchema,
    MapSceneSchema,
    NewspaperSceneSchema,
])
// Complete video schema
export const VideoPlanSchema = z.object({
    topic: z.string(),
    scenes: z.array(VideoSceneSchema),
});

// Export TypeScript types inferred from schemas
export type VideoScene = z.infer<typeof VideoSceneSchema>;
export type VideoPlan = z.infer<typeof VideoPlanSchema>;
export type IntroductionScene = z.infer<typeof IntroductionSceneSchema>;
export type TimelineScene = z.infer<typeof TimelineSceneSchema>;
export type MapScene = z.infer<typeof MapSceneSchema>;
export type NewspaperScene = z.infer<typeof NewspaperSceneSchema>;