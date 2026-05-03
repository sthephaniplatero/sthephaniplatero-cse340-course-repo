import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

console.log("Estoy vivo 👀");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 🔥 SERVIR TODO public (más simple y robusto)
app.use(express.static(path.join(__dirname, "public")));

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================
// ROUTES
// ======================

// Home
app.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
});

// Organizations
app.get("/organizations", (req, res) => {
  res.render("pages/organizations", { title: "Organizations" });
});

// Projects
app.get("/projects", (req, res) => {
  res.render("pages/projects", { title: "Projects" });
});

// Categories
app.get("/categories", (req, res) => {
  res.render("pages/categories", { title: "Categories" });
});

// 🔥 404 handler (MUY útil)
app.use((req, res) => {
  res.status(404).send("404 - Página no encontrada");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});