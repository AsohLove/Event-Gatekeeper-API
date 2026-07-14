import { pool } from "../src/db/dbConnect.js";

try {
    await pool.query(`
        TRUNCATE users, bookings, customers, events RESTART IDENTITY CASCADE;
        `);

    console.log("Database Reset Successfully!!!");
    
} finally {
    await pool.end();
}