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
  showProjectDetailsPage,
  fetchProjects,
  fetchProjectsByOrganization
} from './controllers/projects.js';

// =========================
// CATEGORIES
// =========================
import {
  showCategoriesPage,
  categoryDetails
} from './controllers/categories.js';

// =========================
// OTHERS
// =========================
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
router.get('/project/:id', showProjectDetailsPage);


// =========================
// PROJECTS (API)
// =========================
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