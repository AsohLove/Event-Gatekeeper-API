import createError from 'http-errors';

import * as customers from '../models/customer-model.js'

export async function createCustomer(req, res, next) {
    try {
        const customer = await customers.createCustomer(req.body.full_name, req.body.email);

        res.status(201).json({
            success: true,
            data: customer
        });

    } catch (err) {
        if (err.code === "23505"){
            return next(
                createError(409, "This email already exists!!!")
            );
        }

        next(err)
    }
}


export async function getSingleCustomer(req, res, next) {
    try {
        
        const customer = await customers.findCustomerById(req.params.id);

        if (!customer) {
            throw createError(404, "No customer found!!!")
        }

        res.json({
            success: true,
            data: customer
        });

    } catch (err) {
        next(err);
    }
}