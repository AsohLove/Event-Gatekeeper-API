import createError from "http-errors";

import { pool } from "../db/dbConnect.js";

import * as bookings from "../models/booking-model.js";

export async function createBooking(req, res, next){

    const client = await pool.connect();

    try {

        const eventId = Number(req.params.id);

        const { customer_id, quantity } = req.body;

        await client.query("BEGIN");

        const result = await bookings.reserveBookings(client, eventId, quantity);

        if (result.rowCount === 0) {
            throw createError(409, "Not enough seats are left")
        }

        const created = await bookings.createBooking(client, eventId, customer_id, quantity);


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

export async function getSingleBooking(req, res, next) {
    try {
        
        const booking = await bookings.findBookingById(req.params.id);

        if (!booking) {
            throw createError(404, "No booking found!!!!!")
        }

        res.json({
            success: true,
            data: booking
        });

    } catch (err) {
        next(err);
    }
}

export async function cancelEventBooking(req, res, next) {
    try {
        await bookings.cancelBooking(req.params.id);

        res.sendStatus(204);

    } catch (err) {
        next(err)
    }
}

export async function getEventBookings(req, res, next) {
    try {
        const eventId = Number(req.params.id);

        const { after, limit } = req.validatedQuery;

        const bookingRows = await bookings.getAnEventBookings(eventId, after, limit);

        res.json({
            success: true,
            data: bookingRows,
            nextCursor: bookingRows.length ? bookingRows.at(-1).id : null
        });
    } catch (err) {
        next(err)
    }
}