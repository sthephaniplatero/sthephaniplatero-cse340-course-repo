import { getAllProjects } from '../models/projects.js';

// Controlador para mostrar la lista general de proyectos
export const showProjectsPage = async (req, res) => {
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
};