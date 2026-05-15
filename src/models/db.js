import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config'; // <-- CRUCIAL: Cargar las variables aquí mismo

/**
 * Configuración del Pool de PostgreSQL
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Modificamos esto para que Render lo acepte
    ssl: {
        rejectUnauthorized: false
    }
});

/**
 * Database wrapper (SQL logging en desarrollo)
 */
let db = null;

// Asegúrate de que NODE_ENV esté definido como 'development' en tu .env
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
 * Test DB connection
 */
const testConnection = async () => {
    try {
        // Si DATABASE_URL es undefined, lanzamos un error claro antes de intentar la consulta
        if (!process.env.DATABASE_URL) {
            throw new Error("La variable DATABASE_URL no está definida. Revisa tu archivo .env");
        }

        const result = await db.query('SELECT NOW() as current_time');
        console.log(
            '✅ Database connection successful:',
            result.rows[0].current_time
        );
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        // No lanzamos el throw aquí para que el servidor no se caiga de golpe, 
        // pero puedes dejarlo si prefieres que se detenga.
    }
};

// Esto te ayudará a ver si realmente se cargó la variable
console.log('DATABASE_URL detectada:', process.env.DATABASE_URL ? "SÍ" : "NO (Sigue siendo undefined)");

export { db as default, testConnection };