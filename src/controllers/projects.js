import {
  getAllProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  getCategoriesByProjectId
} from '../models/projects.js';


// ===============================
// PAGE: PROJECT LIST
// ===============================
export const showProjectsPage = async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.render("pages/projects", {
      title: "Projects",
      projects
    });

  } catch (error) {
    console.error("ERROR showProjectsPage:", error);
    res.status(500).send("Error loading projects");
  }
};


// ===============================
// PAGE: PROJECT DETAILS
// ===============================
export const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    if (!projectId) {
      return res.status(400).send("Invalid project ID");
    }

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);

    console.log("PROJECT:", project);
    console.log("CATEGORIES:", categories);

    if (!project) {
      return res.status(404).render("pages/404", {
        title: "Not Found",
        message: "Project not found"
      });
    }

    res.render("pages/project", {
      title: project.title,
      project,
      categories: categories || []
    });

  } catch (error) {
    console.error("🔥 ERROR showProjectDetailsPage:", error);
    res.status(500).send("Error loading project");
  }
};


// ===============================
// API: PROJECTS
// ===============================
export const fetchProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error("ERROR fetchProjects:", error);

    res.status(500).json({
      success: false,
      message: "Error loading projects"
    });
  }
};


// ===============================
// API: PROJECTS BY ORGANIZATION
// ===============================
export const fetchProjectsByOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const projects = await getProjectsByOrganizationId(id);

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error("ERROR fetchProjectsByOrganization:", error);

    res.status(500).json({
      success: false,
      message: "Error loading projects"
    });
  }
};