import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ======================
   FIX __dirname (ESM)
====================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ======================
   STATIC FILES
====================== */
app.use(express.static(path.join(__dirname, "public")));

/* ======================
   EJS CONFIG
====================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "my_app", "views"));

/* ======================
   ROUTES
====================== */

// HOME
app.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
});

// ORGANIZATIONS
app.get("/organizations", (req, res) => {
  res.render("pages/organizations", { title: "Organizations" });
});

// PROJECTS
app.get("/projects", (req, res) => {
  res.render("pages/projects", { title: "Projects" });
});

// CATEGORIES
app.get("/categories", (req, res) => {
  res.render("pages/categories", { title: "Categories" });
});

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "404 - Not Found",
  });
});

/* ======================
   START SERVER (Render safe)
====================== */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});