import { Router } from "express";

import { validate } from '../middleware/validate-middleware.js'
import { createEventSchema, eventIdSchema, paginationSchema } from "../../validations/event-validation.js";
import { createNewEvent, getEvents, getSingleEvent } from "../controllers/event-controller.js";

import { requireAuth } from '../middleware/auth-middleware.js';

 
const router = Router();

router.post('/', validate(createEventSchema), requireAuth,  createNewEvent);

router.get('/', validate(paginationSchema, "query"), getEvents);

router.get('/:id', validate(eventIdSchema, "params"), getSingleEvent);


export default router;