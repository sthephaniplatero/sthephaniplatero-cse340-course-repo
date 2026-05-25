import express from 'express';
import { showHomePage } from './controllers/index.js';

// ORGANIZATIONS
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  fetchOrganizations,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';

// PROJECTS
import {
  showProjectsPage,
  showProjectDetailsPage,
  fetchProjects,
  fetchProjectsByOrganization
} from './controllers/projects.js';

// CATEGORIES
import {
  showCategoriesPage,
  categoryDetails
} from './controllers/categories.js';

// OTHERS
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// =========================
// HOME
// =========================
router.get('/', showHomePage);

// =========================
// ORGANIZATIONS
// =========================
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/organizations/details/:id', showOrganizationDetailsPage);

// API ORGANIZATIONS
router.get('/api/organizations', fetchOrganizations);

// FORMULARIO NUEVA ORGANIZACIÓN
// Unificamos la ruta de creación y aplicamos la validación correctamente
router.get('/organizations/new', showNewOrganizationForm);
router.post('/organizations/new', organizationValidation, processNewOrganizationForm);

// =========================
// PROJECTS
// =========================
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/api/projects', fetchProjects);
router.get('/organizations/:id/projects', fetchProjectsByOrganization);

// =========================
// CATEGORIES
// =========================
router.get('/categories', showCategoriesPage);
router.get('/category/:id', categoryDetails);

// =========================
// OTHERS
// =========================
router.get('/test-error', testErrorPage);

export default router;