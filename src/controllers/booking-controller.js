import createError from "http-errors";

import { pool } from "../db/dbConnect.js";

import * as booking from "../models/booking-model.js";

export async function createBooking(req, res, next){
    const client = await pool.connect();

    try {
        await client.query("BEGIN");


        await client.query("COMMIT");
    } catch (err) {

        await client.query("ROLLBACK");

        next(err)
    } finally {
        client.release();
    }
}