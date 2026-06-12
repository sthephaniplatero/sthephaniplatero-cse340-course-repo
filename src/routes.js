import express from 'express';

import {
  showHomePage
} from './controllers/index.js';

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  requireLogin,
  requireRole,
  showUsersPage
} from './controllers/users.js';

import * as projectModel from './models/projects.js';

// =========================
// ORGANIZATIONS
// =========================
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  fetchOrganizations,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';

// =========================
// PROJECTS
// =========================
import {
  showProjectsPage,
  showProjectDetailsPage,
  fetchProjects,
  fetchProjectsByOrganization,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
} from './controllers/projects.js';

// =========================
// CATEGORIES
// =========================
import {
  showCategoriesPage,
  categoryDetails,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showCreateCategoryForm,
  processCreateCategory,
  showEditCategoryForm,
  processEditCategory
} from './controllers/categories.js';

// =========================
// OTHERS
// =========================
import {
  testErrorPage
} from './controllers/errors.js';

const router = express.Router();


// =========================
// HOME
// =========================
router.get('/', showHomePage);

// Dashboard
router.get('/dashboard', requireLogin, showDashboard);


// =========================
// ORGANIZATIONS
// =========================
router.get('/organizations', showOrganizationsPage);
router.get('/organizations/details/:id', showOrganizationDetailsPage);

router.get('/organizations/new', requireRole('admin'), showNewOrganizationForm);
router.post('/organizations/new', requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/organizations/edit/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/organizations/edit/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

router.get('/api/organizations', fetchOrganizations);


// =========================
// PROJECTS
// =========================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/projects/new', requireRole('admin'), showNewProjectForm);
router.post('/projects/new', requireRole('admin'), projectValidation, processNewProjectForm);

router.get('/projects/edit/:id', requireRole('admin'), showEditProjectForm);
router.post('/projects/edit/:id', requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/api/projects', fetchProjects);
router.get('/organizations/:id/projects', fetchProjectsByOrganization);


// =========================
// CATEGORIES
// =========================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', categoryDetails);

router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), processCreateCategory);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), processEditCategory);


// =========================
// ASSIGN CATEGORIES
// =========================
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);


// =========================
// USERS
// =========================
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);


// =========================
// AUTH
// =========================
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);


// =========================
// VOLUNTEERS
// =========================

// ➕ VOLUNTARIARSE
router.post('/projects/:id/volunteer', requireLogin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    await projectModel.addVolunteer(userId, projectId);

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrarse como voluntario');
  }
});


// ❌ SALIR DE VOLUNTARIO
router.post('/projects/:id/unvolunteer', requireLogin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    await projectModel.removeVolunteer(userId, projectId);

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al salir como voluntario');
  }
});


// ➕ ASIGNAR CUALQUIER VOLUNTARIO (Drag and Drop / Admin)
router.post('/volunteers/add', requireLogin, async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    if (!userId || !projectId) {
      return res.status(400).json({ success: false, error: 'User ID and Project ID are required.' });
    }
    await projectModel.addVolunteer(userId, projectId);

    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.json({ success: true, message: 'Voluntario asignado con éxito.' });
    }
    req.flash('success', 'Voluntario asignado con éxito.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(500).json({ success: false, error: 'Error al asignar voluntario.' });
    }
    req.flash('error', 'Error al asignar voluntario.');
    res.redirect('/dashboard');
  }
});


// ❌ ELIMINAR CUALQUIER VOLUNTARIO (Drag and Drop / Admin / Dashboard)
router.post('/volunteers/remove', requireLogin, async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    if (!userId || !projectId) {
      return res.status(400).json({ success: false, error: 'User ID and Project ID are required.' });
    }
    await projectModel.removeVolunteer(userId, projectId);

    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.json({ success: true, message: 'Voluntario removido con éxito.' });
    }
    req.flash('success', 'Voluntario removido con éxito.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(500).json({ success: false, error: 'Error al remover voluntario.' });
    }
    req.flash('error', 'Error al remover voluntario.');
    res.redirect('/dashboard');
  }
});


// =========================
// ERROR TEST
// =========================
router.get('/test-error', testErrorPage);


export default router;