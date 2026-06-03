import express from 'express';

import {
  showHomePage
} from './controllers/index.js';

import {
  showUserRegistrationForm,
  processUserRegistrationForm
} from './controllers/users.js';


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
// USERS
// =========================
import {
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  requireLogin,
  requireRole
} from './controllers/users.js';


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

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);


// =========================
// ORGANIZATIONS (PROTECTED)
// =========================
router.get('/organizations', showOrganizationsPage);

router.get('/organizations/details/:id', showOrganizationDetailsPage);

router.get('/organizations/new', requireRole('admin'), showNewOrganizationForm);

router.post(
  '/organizations/new',
  requireRole('admin'),
  organizationValidation,
  processNewOrganizationForm
);

router.get(
  '/organizations/edit/:id',
  requireRole('admin'),
  showEditOrganizationForm
);

router.post(
  '/organizations/edit/:id',
  requireRole('admin'),
  organizationValidation,
  processEditOrganizationForm
);

router.get('/api/organizations', fetchOrganizations);


// =========================
// PROJECTS (PROTECTED)
// =========================
router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

router.get(
  '/projects/new',
  requireRole('admin'),
  showNewProjectForm
);

router.post(
  '/projects/new',
  requireRole('admin'),
  projectValidation,
  processNewProjectForm
);

router.get(
  '/projects/edit/:id',
  requireRole('admin'),
  showEditProjectForm
);

router.post(
  '/projects/edit/:id',
  requireRole('admin'),
  projectValidation,
  processEditProjectForm
);

router.get('/api/projects', fetchProjects);

router.get('/organizations/:id/projects', fetchProjectsByOrganization);


// =========================
// CATEGORIES (PROTECTED)
// =========================
router.get('/categories', showCategoriesPage);

router.get('/category/:id', categoryDetails);

router.get(
  '/new-category',
  requireRole('admin'),
  showCreateCategoryForm
);

router.post(
  '/new-category',
  requireRole('admin'),
  processCreateCategory
);

router.get(
  '/edit-category/:id',
  requireRole('admin'),
  showEditCategoryForm
);

router.post(
  '/edit-category/:id',
  requireRole('admin'),
  processEditCategory
);


// =========================
// ASSIGN CATEGORIES (PROTECTED)
// =========================
router.get(
  '/assign-categories/:projectId',
  requireRole('admin'),
  showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  requireRole('admin'),
  processAssignCategoriesForm
);


// =========================
// AUTH ROUTES
// =========================
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);


// =========================
// OTHER ROUTES
// =========================
router.get('/test-error', testErrorPage);


// =========================
// REGISTER
// =========================
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

export default router;