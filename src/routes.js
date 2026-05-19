import express from 'express';

import { showHomePage } from './controllers/index.js';
// 1. Importamos tanto la página de la lista como la de detalles
import { 
  showOrganizationsPage, 
  showOrganizationDetailsPage 
} from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

// Ruta para ver TODAS las organizaciones (Asegúrate de que coincida con tu proyecto)
router.get('/organizations', showOrganizationsPage);

// 2. CORRECCIÓN: Cambiado a '/organization/:id' (en singular) para que coincida con los enlaces de la vista
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// test route
router.get('/test-error', testErrorPage);

export default router;