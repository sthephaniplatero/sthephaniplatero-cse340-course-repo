import db from '../models/db.js';

// ===============================
// 1. TODOS LOS PROYECTOS
// ===============================
export const getAllProjects = async () => {
  const query = `
    SELECT 
      project_id, 
      organization_id, 
      title, 
      description, 
      location, 
      project_date
    FROM public.service_projects
    ORDER BY project_date DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};


// ===============================
// 2. PROYECTOS POR ORGANIZACIÓN
// ===============================
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
    ORDER BY project_date DESC;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};


// ===============================
// 3. UPCOMING PROJECTS
// ===============================
export const getUpcomingProjects = async (limit = 5) => {
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
      ON p.organization_id = o.organization_id
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [limit]);
  return result.rows;
};


// ===============================
// 4. PROJECT DETAILS
// ===============================
export const getProjectDetails = async (id) => {
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
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rows[0] || null;
};


// ===============================
// 5. CATEGORY BY ID
// ===============================
export const getCategoryById = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      category_name
    FROM public.categories
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0] || null;
};


// ===============================
// 6. CATEGORIES BY PROJECT
// ===============================
export const getCategoriesByProjectId = async (projectId) => {
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

  const result = await db.query(query, [projectId]);
  return result.rows;
};


// ===============================
// 7. PROJECTS BY CATEGORY
// ===============================
export const getProjectsByCategoryId = async (categoryId) => {
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

  const result = await db.query(query, [categoryId]);
  return result.rows;
};