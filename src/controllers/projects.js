import {
  getAllProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  getCategoriesByProjectId,
  createProject,
  getProjectById,
  updateProjectById,
  getUserVolunteeredProjects,


} from '../models/projects.js';

import {
  getAllOrganizations
} from '../models/organizations.js';

import {
  body,
  validationResult
} from 'express-validator';




// ===============================
// PROJECT VALIDATION RULES
// ===============================
export const projectValidation = [

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({
      min: 3,
      max: 200
    })
    .withMessage(
      'Title must be between 3 and 200 characters'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({
      max: 1000
    })
    .withMessage(
      'Description must be less than 1000 characters'
    ),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({
      max: 200
    })
    .withMessage(
      'Location must be less than 200 characters'
    ),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage(
      'Date must be a valid date format'
    ),

  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage(
      'Organization must be a valid integer'
    )
];


// ===============================
// PAGE: PROJECT LIST
// ===============================
export const showProjectsPage =
  async (req, res) => {

    try {

      const projects =
        await getAllProjects();

      res.render(
        'pages/projects',
        {
          title: 'Projects',
          projects
        }
      );

    } catch (error) {

      console.error(
        'ERROR showProjectsPage:',
        error
      );

      res.status(500).send(
        'Error loading projects'
      );
    }
  };


// ===============================
// PAGE: PROJECT DETAILS
// ===============================
export const showProjectDetailsPage =
  async (req, res) => {

    try {

      const projectId =
        parseInt(req.params.id);

      if (!projectId) {
        return res.status(400).send('Invalid project ID');
      }

      // =========================
      // PROJECT DATA
      // =========================
      const project =
        await getProjectDetails(projectId);

      const categories =
        await getCategoriesByProjectId(projectId);

      if (!project) {
        return res.status(404).render('pages/404', {
          title: 'Not Found',
          message: 'Project not found'
        });
      }

      // =========================
      // VOLUNTEER LOGIC
      // =========================
      let isVolunteer = false;

if (req.session.user) {

  const userId = req.session.user.id;

  const userProjects =
    await getUserVolunteeredProjects(userId);

  isVolunteer = userProjects.some(
    (p) => p.project_id === projectId
  );
}
      // =========================
      // RENDER VIEW
      // =========================
      res.render('pages/project', {
        title: project.title,
        project,
        categories: categories || [],
        user: req.session.user || null,
        isVolunteer
      });

    } catch (error) {

      console.error('ERROR showProjectDetailsPage:', error);

      res.status(500).send('Error loading project');
    }
  };

// ===============================
// API: PROJECTS
// ===============================
export const fetchProjects =
  async (req, res) => {

    try {

      const projects =
        await getAllProjects();

      res.json({
        success: true,
        data: projects
      });

    } catch (error) {

      console.error(
        'ERROR fetchProjects:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Error loading projects'
      });
    }
  };


// ===============================
// API: PROJECTS BY ORGANIZATION
// ===============================
export const fetchProjectsByOrganization =
  async (req, res) => {

    try {

      const { id } = req.params;

      const projects =
        await getProjectsByOrganizationId(
          id
        );

      res.json({
        success: true,
        data: projects
      });

    } catch (error) {

      console.error(
        'ERROR fetchProjectsByOrganization:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Error loading projects'
      });
    }
  };


// ===============================
// NEW PROJECT FORM
// ===============================
export const showNewProjectForm =
  async (req, res) => {

    try {

      const organizations =
        await getAllOrganizations();

      res.render(
        'pages/new-project',
        {
          title:
            'Add New Service Project',
          organizations
        }
      );

    } catch (error) {

      console.error(
        'Error loading new project form:',
        error
      );

      res.status(500).send(
        'Error loading form'
      );
    }
  };


// ===============================
// PROCESS NEW PROJECT
// ===============================
export const processNewProjectForm =
  async (req, res) => {

    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {

      errors.array().forEach(
        (error) => {

          req.flash(
            'error',
            error.msg
          );
        }
      );

      return res.redirect(
        '/projects/new'
      );
    }

    const {
      title,
      description,
      location,
      date,
      organizationId
    } = req.body;

    try {

      const newProjectId =
        await createProject(
          title,
          description,
          location,
          date,
          organizationId
        );

      req.flash(
        'success',
        'New service project created successfully!'
      );

      res.redirect(
        `/project/${newProjectId}`
      );

    } catch (error) {

      console.error(
        'Error creating new project:',
        error
      );

      req.flash(
        'error',
        'There was an error creating the service project.'
      );

      res.redirect(
        '/projects/new'
      );
    }
  };


// ===============================
// EDIT PROJECT FORM
// ===============================
export const showEditProjectForm =
  async (req, res) => {

    try {

      const projectId =
        parseInt(req.params.id);

      if (!projectId) {

        return res.status(400).send(
          'Invalid project ID'
        );
      }

      const project =
        await getProjectById(
          projectId
        );

      if (!project) {

        return res.status(404).render(
          'pages/404',
          {
            title: 'Not Found',
            message:
              'Project not found'
          }
        );
      }

      const organizations =
        await getAllOrganizations();

      res.render(
        'pages/edit-project',
        {
          title: 'Edit Project',
          project,
          organizations
        }
      );

    } catch (error) {

      console.error(
        'ERROR showEditProjectForm:',
        error
      );

      res.status(500).send(
        'Error loading edit form'
      );
    }
  };


// ===============================
// PROCESS EDIT PROJECT
// ===============================
export const processEditProjectForm =
  async (req, res) => {

    const errors =
      validationResult(req);

    const projectId =
      parseInt(req.params.id);

    if (!errors.isEmpty()) {

      errors.array().forEach(
        (error) => {

          req.flash(
            'error',
            error.msg
          );
        }
      );

      return res.redirect(
        `/projects/edit/${projectId}`
      );
    }

    const {
      title,
      description,
      location,
      date,
      organizationId
    } = req.body;

    try {

      await updateProjectById(
        projectId,
        title,
        description,
        location,
        date,
        organizationId
      );

      req.flash(
        'success',
        'Project updated successfully!'
      );

      res.redirect(
        `/project/${projectId}`
      );

    } catch (error) {

      console.error(
        'ERROR processEditProjectForm:',
        error
      );

      req.flash(
        'error',
        'Error updating project'
      );

      res.redirect(
        `/projects/edit/${projectId}`
      );
    }
  };

  