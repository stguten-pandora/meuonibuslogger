import pg from 'pg';
import fs from "node:fs/promises";
import path from "node:path";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
    port: process.env.PG_PORT
});

try {
    const client = await pool.connect();
    const sql = await fs.readFile(path.join(process.cwd(), 'database.sql'), 'utf8');
    await client.query(sql);
    client.release();
} catch (error) {
    console.error('Error initializing PostgreSQL pool:', error);
}

export default pool;