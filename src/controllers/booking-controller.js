import createError from "http-errors";

import { pool } from "../db/dbConnect.js";

import * as booking from "../models/booking-model.js";

export async function createBooking(req, res, next){

    const client = await pool.connect();

    try {

        const eventId = Number(req.params.id);

        const { customer_id, quantity } = req.body;

        await client.query("BEGIN");

        const result = await booking.reserveBookings(client, eventId, quantity);

        if (result.rowCount === 0) {
            throw createError(409, "Not enough seats are left")
        }

        const created = await booking.createBooking(client, eventId, customer_id, quantity);


        await client.query("COMMIT");

        res.status(201)
           .location(`/bookings/${created.id}`)
           .json({
                success: true,
                data: created
           });
    } catch (err) {

        if (err.code === "23503") {
            return next(createError(400, "Unknown event or customer."));
        }

        await client.query("ROLLBACK");

        next(err)

    } finally {
        client.release();
    }
}