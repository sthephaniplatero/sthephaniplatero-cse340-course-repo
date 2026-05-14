import dotenv from "dotenv";
dotenv.config();

import { Pool } from 'pg';

/**
 * PostgreSQL Connection Pool
 */

console.log("DB PASSWORD:", process.env.DB_PASSWORD);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false
});

/**
 * Wrapper for development logging
 */
let db = null;

if (
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_SQL_LOGGING === 'true'
) {

    db = {
        async query(text, params) {

            try {

                const start = Date.now();

                const res = await pool.query(text, params);

                const duration = Date.now() - start;

                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });

                return res;

            } catch (error) {

                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });

                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };

} else {

    db = pool;
}

/**
 * Test database connection
 */
const testConnection = async () => {

    try {

        const result = await db.query(
            'SELECT NOW() as current_time'
        );

        console.log(
            'Database connection successful:',
            result.rows[0].current_time
        );

        return true;

    } catch (error) {

        console.error(
            'Database connection failed:',
            error.message
        );

        throw error;
    }
};

export { db as default, testConnection };