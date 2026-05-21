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
    FROM public.service_projects;
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
    ORDER BY project_date;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};


// ===============================
// 3. UPCOMING PROJECTS (REQUERIDO)
// ===============================
export const getUpcomingProjects = async (limit) => {
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
    JOIN public.organizations o 
      ON p.organization_id = o.organization_id
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date ASC
    LIMIT $1
  `;

  const result = await db.query(query, [limit]);
  return result.rows;
};


// ===============================
// 4. PROJECT DETAILS (🔥 FALTABA ESTO)
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
    JOIN public.organizations o
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result = await db.query(query, [id]);

  console.log("PROJECT FROM DB:", result.rows[0]); // 🔥 CORRECTO

  return result.rows.length > 0 ? result.rows[0] : null;
};