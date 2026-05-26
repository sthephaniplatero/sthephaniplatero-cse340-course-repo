import db from './db.js';

// ===============================
// GET ALL CATEGORIES
// ===============================
export const getAllCategories = async () => {
  const query = `
    SELECT * FROM categories
    ORDER BY category_name ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};


// ===============================
// GET CATEGORIES BY PROJECT
// ===============================
export const getProjectCategories = async (projectId) => {
  const query = `
    SELECT category_id
    FROM project_categories
    WHERE project_id = $1;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows.map(row => row.category_id);
};


// ===============================
// ASSIGN ONE CATEGORY
// ===============================
const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2);
  `;

  await db.query(query, [projectId, categoryId]);
};


// ===============================
// UPDATE ALL ASSIGNMENTS
// ===============================
export const updateCategoryAssignments = async (projectId, categoryIds) => {

  // eliminar asignaciones previas
  await db.query(
    `DELETE FROM project_categories WHERE project_id = $1`,
    [projectId]
  );

  // evitar error si viene vacío
  if (!categoryIds || categoryIds.length === 0) return;

  // insertar nuevas
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};