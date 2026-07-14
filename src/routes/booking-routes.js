import { Router } from "express";
import { requireAuth } from "../middleware/auth-middleware.js";

import { validate } from "../middleware/validate-middleware.js";

import { bookingIdSchema, createBookingSchema } from "../../validations/booking-validation.js";

import * as controller from "../controllers/booking-controller.js";
import { eventIdSchema, paginationSchema } from "../../validations/event-validation.js";


const router = Router()



router.post('/events/:id/bookings', 
        validate(eventIdSchema, "params"),
        validate(createBookingSchema), 
        controller.createBooking);

router.get('/bookings/:id', 
        validate(bookingIdSchema, "params"),
        controller.getSingleBooking);

router.post('/bookings/:id/cancel', 
        validate(bookingIdSchema, "params"),
        requireAuth, 
        controller.cancelEventBooking);

router.get('/events/:id/bookings', 
        validate(paginationSchema, "query"), 
        controller.getEventBookings)



export default router;