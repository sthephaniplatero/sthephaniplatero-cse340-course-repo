import express from 'express';

import { showHomePage } from './controllers/index.js';

// =========================
// ORGANIZATIONS
// =========================
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  fetchOrganizations
} from './controllers/organizations.js';

// =========================
// PROJECTS
// =========================
import {
  showProjectsPage,
  showProjectDetailsPage, // 👈 IMPORTANTE (FALTABA)
  fetchProjects,
  fetchProjectsByOrganization
} from './controllers/projects.js';

// =========================
// OTHERS
// =========================
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// =========================
// HOME
// =========================
router.get('/', showHomePage);

// =========================
// ORGANIZATIONS (VIEWS)
// =========================
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// =========================
// ORGANIZATIONS (API)
// =========================
router.get('/api/organizations', fetchOrganizations);

// =========================
// PROJECTS (VIEWS)
// =========================
router.get('/projects', showProjectsPage);

// ⭐ DETALLE DE PROYECTO (LO QUE TE FALTABA)
router.get('/project/:id', showProjectDetailsPage);

// =========================
// PROJECTS (API)
// =========================
router.get('/api/projects', fetchProjects);
router.get('/organizations/:id/projects', fetchProjectsByOrganization);

// =========================
// OTHERS
// =========================
router.get('/categories', showCategoriesPage);
router.get('/test-error', testErrorPage);

export default router;