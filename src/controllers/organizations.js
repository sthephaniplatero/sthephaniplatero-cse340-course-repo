import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// 1. Controlador para mostrar la lista de todas las organizaciones
export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('pages/organizations', { 
            title: 'Partner Organizations', 
            organizations 
        });
    } catch (error) {
        console.error("Error al obtener organizaciones:", error);
        res.status(500).render('pages/404', { title: 'Error', message: 'Error en el servidor' });
    }
};

// 2. Controlador para mostrar el detalle de una organización específica y sus proyectos
export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;

        // Llamamos a los dos modelos en paralelo gracias a los pasos 1 y 2
        const organizationDetails = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);

        // Si la organización no existe en la base de datos
        if (!organizationDetails) {
            return res.status(404).render('pages/404', {
                title: 'Not Found',
                message: 'Organization not found'
            });
        }

        // Renderizamos la vista de la organización con todos sus datos
        res.render('pages/organization', {
            title: 'Organization Details',
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