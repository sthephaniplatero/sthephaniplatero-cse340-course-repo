import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./src/database/connection.js";
import { testConnection } from "./src/models/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

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
app.set("views", path.join(__dirname, "views"));

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
   DATABASE TEST
====================== */
app.get("/db-test", async (req, res) => {
  try {

    const result = await pool.query("SELECT NOW()");

    res.send({
      success: true,
      database_time: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).send({
      success: false,
      error: error.message,
    });

  }
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
   START SERVER
====================== */
app.listen(PORT, async () => {
  try {

    await testConnection();

    console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
    console.log(`🌎 Environment: ${NODE_ENV}`);

  } catch (error) {

    console.error("❌ Error connecting to the database:", error);

  }
});