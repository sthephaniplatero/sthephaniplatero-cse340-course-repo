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

    return result.rows.length > 0
      ? result.rows[0]
      : null;

  } catch (error) {

    console.error(
      'Error getting organization details:',
      error
    );

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

    console.error(
      'Error getting organizations:',
      error
    );

    throw error;
  }
};

// ===============================
// CREAR ORGANIZACIÓN
// ===============================
export const createOrganization = async (
  name,
  description,
  contactEmail,
  logoFilename
) => {

  const query = `
    INSERT INTO public.organizations
    (
      name,
      description,
      contact_email,
      logo_filename
    )
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;

  const result = await db.query(query, [
    name,
    description,
    contactEmail,
    logoFilename
  ]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }

  return result.rows[0].organization_id;
};

// ===============================
// ACTUALIZAR ORGANIZACIÓN
// ===============================
export const updateOrganization = async (
  organizationId,
  name,
  description,
  contactEmail,
  logoFilename
) => {

  const query = `
    UPDATE public.organizations
    SET
      name = $1,
      description = $2,
      contact_email = $3,
      logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;

  const queryParams = [
    name,
    description,
    contactEmail,
    logoFilename,
    organizationId
  ];

  const result = await db.query(
    query,
    queryParams
  );

  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }

  if (
    process.env.ENABLE_SQL_LOGGING === 'true'
  ) {
    console.log(
      'Updated organization with ID:',
      organizationId
    );
  }

  return result.rows[0].organization_id;
};