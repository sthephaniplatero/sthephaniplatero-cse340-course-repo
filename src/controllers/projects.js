import {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByOrganizationId
} from '../models/projects.js';


// ===============================
// CONSTANTE REQUERIDA
// ===============================
const NUMBER_OF_UPCOMING_PROJECTS = 5;


// ===============================
// API: TODOS LOS PROYECTOS
// ===============================
export const fetchProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error en controller projects:', error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos'
    });
  }
};


// ===============================
// API: PROYECTOS POR ORGANIZACIÓN
// ===============================
export const fetchProjectsByOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const projects = await getProjectsByOrganizationId(id);

    res.status(200).json({
      success: true,
      organization_id: id,
      data: projects
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos por organización'
    });
  }
};


// ===============================
// PÁGINA: LISTA DE PROYECTOS (REQUIRED)
// ===============================
export const showProjectsPage = async (req, res) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render("pages/projects", { 
      title: "Upcoming Service Projects",
      projects 
    });

  } catch (error) {
    console.error("Error al cargar proyectos:", error.message);
    res.status(500).send("Error interno del servidor");
  }
};


// ===============================
// PÁGINA: DETALLE DE PROYECTO (REQUIRED)
// ===============================
export const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    const project = await getProjectDetails(projectId);

    // 👇 ESTE ES EL LOG QUE NECESITAS
    console.log("PROJECT FROM DB:", project);

    if (!project) {
      return res.status(404).render('pages/404', {
        title: 'Not Found',
        message: 'Project not found'
      });
    }

    res.render("pages/project", {
      title: project.title,
      project
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading project");
  }
};