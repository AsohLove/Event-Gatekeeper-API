import { pool } from "../src/db/dbConnect";

try {
    await pool.query(`
        TRUNCATE bookings, customers, events RESTART IDENTITY CASCADE;
        `);

    console.log("Database Reset Successfully!!!");
    
} finally {
    await pool.end();
}