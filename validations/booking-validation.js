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