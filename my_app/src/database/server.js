import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { getAllOrganizations } from "../models/organizations.js";
import db, { testConnection } from "../models/db.js";

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* __dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* STATIC */
app.use(express.static(path.join(__dirname, "../public")));

/* EJS */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

/* ROUTES */

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
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack
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

app.use((req, res) => {
  res.status(404).render("pages/404", { title: "404 - Not Found" });
});

/* START SERVER SAFE */
async function startServer() {
  try {
    await testConnection();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();