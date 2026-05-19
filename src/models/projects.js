import db from '../models/db.js'; 

// 1. Obtener todos los proyectos generales
export const getAllProjects = async () => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
        FROM public.service_projects;
    `;
    const result = await db.query(query);
    return result.rows;
};

// 2. Obtener proyectos asociados a una organización específica
export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
      SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        project_date
      FROM public.service_projects
      WHERE organization_id = $1
      ORDER BY project_date;
    `;
    
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};