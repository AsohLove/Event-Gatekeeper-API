import { pool }  from '../db/dbConnect.js';

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
