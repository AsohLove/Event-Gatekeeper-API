import { Router } from "express";
import { requireAuth } from "../middleware/auth-middleware.js";

import { validate } from "../middleware/validate-middleware.js";

import { bookingIdSchema, createBookingSchema, querySchema } from "../../validations/booking-validation.js";

import * as controller from "../controllers/booking-controller.js";
import { eventIdSchema } from "../../validations/event-validation.js";


const router = Router()


router.use(requireAuth);

router.post('/events/:id/bookings', 
        validate(eventIdSchema, "params"),
        validate(createBookingSchema), 
        controller.createBooking);

router.get('/bookings/:id', validate(bookingIdSchema, "params"), controller.getSingleBooking);

router.post('/bookings/:id/cancel', validate(bookingIdSchema, "params"), controller.cancelEventBooking);

router.get('/events/:id/bookings', 
        validate(querySchema, "query"), 
        controller.getEventBookings)



export default router;