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
    console.error("Error al obtener organizaciones:", error);

    res.status(500).render('pages/404', { 
      title: 'Error', 
      message: 'Error en el servidor' 
    });
  }
};


// ===============================
// DETALLE DE ORGANIZACIÓN
// ===============================
export const showOrganizationDetailsPage = async (req, res) => {
  try {
    const organizationId = parseInt(req.params.id);

    // Validación del ID
    if (isNaN(organizationId)) {
      return res.status(400).render('pages/404', {
        title: 'Error',
        message: 'Invalid organization ID'
      });
    }

    // Obtener datos de organización
    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
      return res.status(404).render('pages/404', {
        title: 'Not Found',
        message: 'Organization not found'
      });
    }

    // Obtener proyectos de esa organización
    const projects = await getProjectsByOrganizationId(organizationId);

    // Render vista
    res.render('pages/organization', {
      title: organizationDetails.name,
      organizationDetails,
      projects
    });

  } catch (error) {
    console.error("Error al obtener detalle de organización:", error);

    res.status(500).render('pages/404', {
      title: 'Error 500',
      message: 'Error al cargar organización'
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
    console.error('Error en controller organizations:', error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener organizaciones'
    });
  }
};