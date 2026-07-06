import { readFileSync } from 'node:fs'
import { pool } from '../src/db/dbConnect.js';

const schema = readFileSync(
    new URL("../db/schema.sql", import.meta.url), "utf8"
);

await pool.query(schema);

console.log("Database migrated successfully!!!");

await pool.end();
