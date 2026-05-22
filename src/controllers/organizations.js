import { 
  getAllOrganizations, 
  getOrganizationDetails 
} from '../models/organizations.js';

import { 
  getProjectsByOrganizationId 
} from '../models/projects.js';


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

    // VALIDACIÓN ID
    if (!Number.isInteger(organizationId)) {
      return res.status(400).render('pages/404', {
        title: 'Invalid Request',
        message: 'Invalid organization ID'
      });
    }

    // ORGANIZACIÓN
    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
      return res.status(404).render('pages/404', {
        title: 'Not Found',
        message: 'Organization not found'
      });
    }

    // PROYECTOS
    const projects = await getProjectsByOrganizationId(organizationId);

    // VIEW
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
// API: ORGANIZACIONES (JSON)
// ===============================
export const fetchOrganizations = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();

    res.status(200).json({
      success: true,
      data: organizations
    });

  } catch (error) {
    console.error('Error fetching organizations:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error retrieving organizations'
    });
  }
};