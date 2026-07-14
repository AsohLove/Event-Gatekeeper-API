import { pool } from '../db/dbConnect.js'

export async function createEvent({name, venue, starts_at, capacity, organizer_id}){
    const { rows } = await pool.query(`
            INSERT INTO events 
                (name, venue, starts_at, capacity, seats_remaining, organizer_id)
            VALUES
                ($1, $2, $3, $4, $4, $5)
            RETURNING *;

        `, [name, venue, starts_at, capacity, organizer_id]
    );

    return rows[0];
}

export async function findEventById(id){
    const { rows } = await pool.query(`
            SELECT * 
            FROM events
            WHERE id = $1;
        `, [id]
    );

    return rows[0];
}

export async function findEvents(after = 0, limit = 10) {
    const { rows } = await pool.query(`
            SELECT * 
            FROM events
            WHERE id > $1
            ORDER BY id
            LIMIT $2;

        `, [after, limit]
    );

    return rows;
}