import { z } from 'zod'

export const createBookingSchema = z.object({
    customer_id: z
            .number()
            .int()
            .positive(),
    quantity: z
        .number()
        .int()
        .min(1)
        .max(10)
  
});

export const querySchema = z.object({
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

export const bookingIdSchema = z.object({
    id: z.coerce.number().int().positive()
});