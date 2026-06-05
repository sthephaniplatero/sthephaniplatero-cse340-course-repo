import db from '../models/db.js';


// ===============================
// 1. TODOS LOS PROYECTOS
// ===============================
export const getAllProjects = async () => {

  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      o.name AS organization_name
    FROM public.service_projects p
    INNER JOIN public.organizations o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date DESC;
  `;

  const result = await db.query(query);

  return result.rows;
};


// ===============================
// 2. PROYECTOS POR ORGANIZACIÓN
// ===============================
export const getProjectsByOrganizationId =
  async (organizationId) => {

    const query = `
      SELECT
        p.project_id,
        p.organization_id,
        p.title,
        p.description,
        p.location,
        p.project_date,
        o.name AS organization_name
      FROM public.service_projects p
      INNER JOIN public.organizations o
        ON p.organization_id = o.organization_id
      WHERE p.organization_id = $1
      ORDER BY p.project_date DESC;
    `;

    const result = await db.query(
      query,
      [organizationId]
    );

    return result.rows;
  };


// ===============================
// 3. UPCOMING PROJECTS
// ===============================
export const getUpcomingProjects =
  async (limit = 5) => {

    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date,
        p.organization_id,
        o.name AS organization_name
      FROM public.service_projects p
      INNER JOIN public.organizations o
        ON p.organization_id =
           o.organization_id
      WHERE p.project_date >= CURRENT_DATE
      ORDER BY p.project_date ASC
      LIMIT $1;
    `;

    const result = await db.query(
      query,
      [limit]
    );

    return result.rows;
  };


// ===============================
// 4. PROJECT DETAILS
// ===============================
export const getProjectDetails =
  async (id) => {

    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.project_date,
        p.location,
        p.organization_id,
        o.name AS organization_name
      FROM public.service_projects p
      INNER JOIN public.organizations o
        ON p.organization_id =
           o.organization_id
      WHERE p.project_id = $1;
    `;

    const result = await db.query(
      query,
      [id]
    );

    return result.rows[0] || null;
  };


// ===============================
// 5. CATEGORY BY ID
// ===============================
export const getCategoryById =
  async (categoryId) => {

    const query = `
      SELECT
        category_id,
        category_name
      FROM public.categories
      WHERE category_id = $1;
    `;

    const result = await db.query(
      query,
      [categoryId]
    );

    return result.rows[0] || null;
  };


// ===============================
// 6. CATEGORIES BY PROJECT
// ===============================
export const getCategoriesByProjectId =
  async (projectId) => {

    const query = `
      SELECT
        c.category_id,
        c.category_name
      FROM public.categories c
      INNER JOIN public.project_categories pc
        ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.category_name;
    `;

    const result = await db.query(
      query,
      [projectId]
    );

    return result.rows;
  };


// ===============================
// 7. PROJECTS BY CATEGORY
// ===============================
export const getProjectsByCategoryId =
  async (categoryId) => {

    const query = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date
      FROM public.service_projects p
      INNER JOIN public.project_categories pc
        ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.project_date DESC;
    `;

    const result = await db.query(
      query,
      [categoryId]
    );

    return result.rows;
  };


// ===============================
// 8. CREATE PROJECT
// ===============================
export const createProject = async (
  title,
  description,
  location,
  date,
  organizationId
) => {

  const query = `
    INSERT INTO public.service_projects
    (
      title,
      description,
      location,
      project_date,
      organization_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId
  ];

  const result = await db.query(
    query,
    queryParams
  );

  if (result.rows.length === 0) {

    throw new Error(
      'Failed to create project'
    );
  }

  if (
    process.env.ENABLE_SQL_LOGGING === 'true'
  ) {

    console.log(
      'Created new project with ID:',
      result.rows[0].project_id
    );
  }

  return result.rows[0].project_id;
};

// ===============================
// 9. GET PROJECT BY ID
// ===============================
export const getProjectById =
  async (projectId) => {

    const query = `
      SELECT
        project_id,
        title,
        description,
        location,
        project_date,
        organization_id
      FROM public.service_projects
      WHERE project_id = $1;
    `;

    const result = await db.query(
      query,
      [projectId]
    );

    return result.rows[0] || null;
  };


// ===============================
// 10. UPDATE PROJECT
// ===============================
export const updateProjectById =
  async (
    projectId,
    title,
    description,
    location,
    projectDate,
    organizationId
  ) => {

    const query = `
      UPDATE public.service_projects
      SET
        title = $1,
        description = $2,
        location = $3,
        project_date = $4,
        organization_id = $5
      WHERE project_id = $6;
    `;

    const queryParams = [
      title,
      description,
      location,
      projectDate,
      organizationId,
      projectId
    ];

    await db.query(
      query,
      queryParams
    );
  };

// ===============================
// VOLUNTEERS
// ===============================

// ➕ Agregar voluntario
export const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO public.project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING;
  `;

  await db.query(query, [userId, projectId]);
};


// ❌ Eliminar voluntario
export const removeVolunteer = async (userId, projectId) => {
  const query = `
    DELETE FROM public.project_volunteers
    WHERE user_id = $1 AND project_id = $2;
  `;

  await db.query(query, [userId, projectId]);
};


// 📋 Obtener proyectos donde el usuario es voluntario
export const getUserVolunteeredProjects = async (userId) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      o.name AS organization_name
    FROM public.service_projects p
    INNER JOIN public.project_volunteers pv 
      ON pv.project_id = p.project_id
    INNER JOIN public.organizations o
      ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.project_date DESC;
  `;

  const result = await db.query(query, [userId]);

  return result.rows;
};