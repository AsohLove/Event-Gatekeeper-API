import { Router } from "express";
import { validate } from "../middleware/validate-middleware.js";

import { createCustomerSchema, customerIdSchema } from "../../validations/customer-validation.js"
import { createCustomer, getSingleCustomer } from "../controllers/customer-controller.js";


const router = Router();


router.post('/', validate(createCustomerSchema), createCustomer);

router.get('/:id', validate(customerIdSchema, "params"), getSingleCustomer)



export default router;
