import db from '../models/db.js';

// ===============================
// DETALLE DE ORGANIZACIÓN
// ===============================
export const getOrganizationDetails = async (organizationId) => {
  try {
    const result = await db.query(`
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM public.organizations
      WHERE organization_id = $1;
    `, [organizationId]);

    return result.rows.length > 0 ? result.rows[0] : null;

  } catch (error) {
    console.error('Error getting organization details:', error);
    throw error;
  }
};


// ===============================
// TODAS LAS ORGANIZACIONES
// ===============================
export const getAllOrganizations = async () => {
  try {
    const result = await db.query(`
      SELECT 
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM public.organizations
      ORDER BY organization_id DESC;
    `);

    return result.rows;

  } catch (error) {
    console.error('Error getting organizations:', error);
    throw error;
  }
};