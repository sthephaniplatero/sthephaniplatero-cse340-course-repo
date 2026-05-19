import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Router
import router from "./src/routes.js";

// DB
import db, { testConnection } from "./src/models/db.js";

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* __dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   CONFIGURACIÓN EXPRESS
========================= */

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   MIDDLEWARES
========================= */

// Log de requests (solo dev)
app.use((req, res, next) => {
  if (NODE_ENV === "development") {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Variables globales para vistas
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

/* =========================
   RUTAS
========================= */

app.use(router);

/* =========================
   DB TEST ROUTE (opcional)
========================= */

app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.send({
      success: true,
      database_time: result.rows[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

/* =========================
   INICIO DEL SERVIDOR
========================= */

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`✅ Servidor corriendo en: http://127.0.0.1:${PORT}`);
    console.log(`🚀 Entorno: ${NODE_ENV}`);
  } catch (error) {
    console.error(
      "❌ No se pudo conectar a la base de datos al iniciar:",
      error.message
    );
  }
});