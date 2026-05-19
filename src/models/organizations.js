import db from '../models/db.js'; 

// 1. Obtener todas las organizaciones
export const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organizations;
    `;
    const result = await db.query(query);
    return result.rows;
};

// 2. Obtener los detalles de una organización específica
export const getOrganizationDetails = async (organizationId) => {
    const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM public.organizations
      WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    // Retorna la primera fila o null si no existe
    return result.rows.length > 0 ? result.rows[0] : null;
};