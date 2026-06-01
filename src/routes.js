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

  // 🔥 NEW
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


// =========================
// ORGANIZATIONS
// =========================
router.get('/organizations', showOrganizationsPage);

router.get('/organizations/details/:id', showOrganizationDetailsPage);

router.get('/organizations/new', showNewOrganizationForm);

router.post(
  '/organizations/new',
  organizationValidation,
  processNewOrganizationForm
);

router.get('/organizations/edit/:id', showEditOrganizationForm);

router.post(
  '/organizations/edit/:id',
  organizationValidation,
  processEditOrganizationForm
);

router.get('/api/organizations', fetchOrganizations);


// =========================
// PROJECTS
// =========================
router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

router.get('/projects/new', showNewProjectForm);

router.post(
  '/projects/new',
  projectValidation,
  processNewProjectForm
);

// 🔥 EDIT PROJECT
router.get(
  '/projects/edit/:id',
  showEditProjectForm
);

router.post(
  '/projects/edit/:id',
  projectValidation,
  processEditProjectForm
);

router.get('/api/projects', fetchProjects);

router.get('/organizations/:id/projects', fetchProjectsByOrganization);


// =========================
// 🔥 ASSIGN CATEGORIES
// =========================
router.get(
  '/assign-categories/:projectId',
  showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  processAssignCategoriesForm
);


// =========================
// CATEGORIES
// =========================
router.get('/categories', showCategoriesPage);

router.get('/category/:id', categoryDetails);


// =========================
// OTHERS
// =========================
router.get('/test-error', testErrorPage);


router.get('/new-category', showCreateCategoryForm);

router.post('/new-category', processCreateCategory);

router.get('/edit-category/:id', showEditCategoryForm);

router.post('/edit-category/:id', processEditCategory);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

export default router;