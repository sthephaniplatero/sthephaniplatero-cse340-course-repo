import dotenv from "dotenv";
dotenv.config(); // Esto debe ir siempre en la primera línea

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Importar modelos y conexión
import { getAllOrganizations } from "./src/models/organizations.js";
import db, { testConnection } from "./src/models/db.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";

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


// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/* RUTAS */

app.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
});



app.get("/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render("pages/projects", { 
      title: "Service Projects", 
      projects 
    });
  } catch (error) {
    console.error("Error al cargar proyectos:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render("pages/categories", { title: "Categories", categories });
  } catch (error) {
    console.error("Error al cargar categorías:", error.message);
    res.status(500).send("Error interno del servidor");
  }
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

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});



// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
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