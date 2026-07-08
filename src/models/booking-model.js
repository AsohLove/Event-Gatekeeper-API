import { pool }  from '../db/dbConnect.js';
import createError from 'http-errors';

export async function reserveBookings(client, eventId, quantity) {
    const result = await client.query(
        `
        UPDATE events
        SET seats_remaining = seats_remaining - $1
        WHERE id = $2
            AND status = 'on_sale'
            AND seats_remaining >= $1
        RETURNING seats_remaining
        
        `, [quantity, eventId]
    )

    return result;
}

export async function createBooking(client, eventId, customerId, quantity){
    const { rows } = await client.query(
        `
        INSERT INTO bookings 
            (event_id, customer_id, quantity)
        VALUES
            ($1, $2, $3)
        RETURNING *

        `, [eventId, customerId, quantity]
    );

    return rows[0];
}

export async function findBookingById(id){
    const { rows } = await pool.query(
        `
        SELECT * 
        FROM bookings
        WHERE id = $1

        `, [id]
    )

    return rows[0];
}


export async function cancelBooking(id){
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `
            SELECT * 
            FROM bookings
            WHERE id = $1

            `, [id]
        );

        const booking = result.rows[0];

        if (!booking) {
            throw createError(404, "Booking not found")
        }

        const cancelled = await client.query(
            `
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = $1
            AND status = 'confirmed'
            
            `, [id]
        );

        if (cancelled.rowCount === 0) {
            throw createError(409, "Booking already cancelled!!!");
        }

        await client.query(
            `
            UPDATE events
            SET seats_remaining = seats_remaining + $1
            WHERE id = $2

            `, [booking.quantity, booking.event_id]
        );

        await client.query(
            `
            UPDATE events
            SET status = 'on_sale'
            WHERE id = $1
            AND status = 'sold_out'

            `, [booking.event_id]
        );


        await client.query("COMMIT");


    } catch (err) {
        await client.query("ROLLBACK");

        throw err;

    } finally {

        client.release();
    }
}

export async function getAnEventBookings(eventId, after = 0, limit = 10){
    const { rows } = await pool.query(
        `
        SELECT id, customer_id, quantity, status, booked_at 
        FROM bookings
        WHERE event_id = $1
            AND id > $2
        ORDER BY id
        LIMIT $3
        
        `, [eventId, after, limit]
    )

    return rows;
}