import { Router } from "express";
import { requireAuth } from "../middleware/auth-middleware.js";

import { validate } from "../middleware/validate-middleware.js";

import { createBookingSchema } from "../../validations/booking-validation.js";

import * as controller from "../controllers/booking-controller.js";


const router = Router()


router.use(requireAuth);

router.post('/events/:id/bookings', 
        validate(createBookingSchema), 
        controller.createBooking);

router.get('/bookings/:id', controller.getSingleBooking);



export default router;