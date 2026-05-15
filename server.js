import dotenv from "dotenv";
dotenv.config(); // Esto debe ir siempre en la primera línea

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Importar modelos y conexión
import { getAllOrganizations } from "./src/models/organizations.js";
import db, { testConnection } from "./src/models/db.js";

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* __dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* CONFIGURACIÓN DE RUTAS ESTÁTICAS Y VISTAS
   He quitado el "../" porque tu archivo server.js está en la raíz.
   Ahora buscará dentro de tu proyecto.
*/
app.use(express.static(path.join(__dirname, "public")));

/* CONFIGURACIÓN DE EJS */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* RUTAS */

app.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
});

app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("pages/organizations", {
      title: "Our Partner Organizations",
      organizations
    });
  } catch (error) {
    console.error("Error al obtener organizaciones:", error);
    res.status(500).render("pages/404", { 
      title: "Error 500", 
      message: "Error al cargar organizaciones" 
    });
  }
});

app.get("/projects", (req, res) => {
  res.render("pages/projects", { title: "Projects" });
});

app.get("/categories", (req, res) => {
  res.render("pages/categories", { title: "Categories" });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.send({ success: true, database_time: result.rows[0] });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

/* MANEJO DE 404 */
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "404 - Not Found" });
});

/* INICIO DEL SERVIDOR */
app.listen(PORT, async () => {
  try {
    // Intentar conectar a la base de datos de Render al iniciar
    await testConnection();
    console.log(`✅ Servidor corriendo en: http://127.0.0.1:${PORT}`);
    console.log(`🚀 Entorno: ${NODE_ENV}`);
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos al iniciar:', error.message);
  }
});