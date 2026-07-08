import { z } from 'zod';

export const createCustomerSchema = z.object({
    full_name: z
            .string("Customer name must be a string")
            .trim()
            .min(2, "Customer name must be at least two letters")
            .max(150),

    email: z
        .string("Email should be a string")
        .email('you should provide a valid email')
        .max(200, 'your email is too long (max should be 200 characters)'),
})