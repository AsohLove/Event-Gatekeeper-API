import { z } from "zod";

export const createEventSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Event name must be at least 3 characters")
        .max(150),
    
    venue: z.string()
        .trim()
        .min(2, "venue is required")
        .max(150),
    
    starts_at: z.string()
        .datetime("Invalid start date"),

    capacity: z.number()
        .int()
        .min(1, "Capacity must be at least 1")
        
});

export const eventIdSchema = z.object({
    id: z.coerce
        .number()
        .int()
        .positive()
});

export const paginationSchema = z.object({
    after: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
});