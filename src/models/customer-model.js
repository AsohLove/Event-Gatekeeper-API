import { pool } from "../db/dbConnect.js";

export async function createCustomer(full_name, email) {
    const { rows } = await pool.query(
        `
        INSERT INTO customers
            (full_name, email)
        VALUES
            ($1, $2)
        RETURNING *;
        `,
        [full_name, email]
    );

    return rows[0];
}

export async function findCustomerById(id) {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM customers
        WHERE id = $1;
        `,
        [id]
    );

    return rows[0];
}