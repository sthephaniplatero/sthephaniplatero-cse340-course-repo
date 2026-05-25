import { 
  getAllOrganizations, 
  getOrganizationDetails, 
  createOrganization 
} from '../models/organizations.js';

import { 
  getProjectsByOrganizationId 
} from '../models/projects.js';

import { body, validationResult } from 'express-validator';

// ===============================
// REGLAS DE VALIDACIÓN
// ===============================
export const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Organization description is required')
        .isLength({ max: 500 }).withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty().withMessage('Contact email is required')
        .isEmail().withMessage('Please provide a valid email address')
];

// ===============================
// LISTA DE ORGANIZACIONES
// ===============================
export const showOrganizationsPage = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('pages/organizations', { 
      title: 'Partner Organizations', 
      organizations 
    });
  } catch (error) {
    console.error("Error loading organizations:", error.message);
    res.status(500).render('pages/404', { 
      title: 'Error', 
      message: 'Internal server error while loading organizations'
    });
  }
};

// ===============================
// DETALLE DE ORGANIZACIÓN
// ===============================
export const showOrganizationDetailsPage = async (req, res) => {
  try {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId)) {
      return res.status(400).render('pages/404', {
        title: 'Invalid Request',
        message: 'Invalid organization ID'
      });
    }

    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
      return res.status(404).render('pages/404', {
        title: 'Not Found',
        message: 'Organization not found'
      });
    }

    const projects = await getProjectsByOrganizationId(organizationId);

    res.render('pages/organization', {
      title: organizationDetails.name,
      organizationDetails,
      projects: projects || []
    });

  } catch (error) {
    console.error("Error loading organization details:", error.message);
    res.status(500).render('pages/404', {
      title: 'Server Error',
      message: 'Error loading organization details'
    });
  }
};

// ===============================
// NUEVA ORGANIZACIÓN (FORMULARIO)
// ===============================
export const showNewOrganizationForm = async (req, res) => {
    res.render('pages/new-organization', { title: 'Add New Organization' });
};

export const processNewOrganizationForm = async (req, res) => {
    // 1. Manejo de resultados de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/organizations/new');
    }

    // 2. Procesamiento de creación
    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization added successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error creating organization:', error.message);
        req.flash('error', 'Server error. Please try again.');
        res.redirect('/organizations/new');
    }
};

// ===============================
// API: ORGANIZACIONES (JSON)
// ===============================
export const fetchOrganizations = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.status(200).json({ success: true, data: organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error.message);
    res.status(500).json({ success: false, message: 'Error retrieving organizations' });
  }
};