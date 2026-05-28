import {
  getAllCategories,
  getProjectCategories,
  updateCategoryAssignments,
  createCategory,
  updateCategory
} from '../models/categories.js';

import {
  getCategoryById,
  getProjectsByCategoryId,
  getProjectDetails
} from '../models/projects.js';

// ===============================
// ALL CATEGORIES PAGE
// ===============================
export const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render("pages/categories", { title: "Categories", categories });
  } catch (error) {
    console.error("Error loading categories:", error);
    res.status(500).send("Internal server error");
  }
};

// ===============================
// CATEGORY DETAILS PAGE
// ===============================
export const categoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) return res.status(404).send("Category not found");

    res.render("pages/category-details", { title: "Category Details", category, projects });
  } catch (error) {
    console.error("Error loading category details:", error);
    res.status(500).send("Internal server error");
  }
};

// ===============================
// ASSIGN CATEGORIES
// ===============================
export const showAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getProjectCategories(projectId);

    res.render("pages/assign-categories", { title: "Assign Categories", projectId, projectDetails, categories, assignedCategories });
  } catch (error) {
    console.error("Error loading assign form:", error);
    res.status(500).send("Internal server error");
  }
};

export const processAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    let categoryIds = req.body.categoryIds || [];
    if (!Array.isArray(categoryIds)) categoryIds = [categoryIds];
    
    await updateCategoryAssignments(projectId, categoryIds);
    req.flash("success", "Categories updated successfully");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating categories:", error);
    req.flash("error", "Error updating categories");
    res.redirect(`/project/${req.params.projectId}`);
  }
};

// ===============================
// CREATE CATEGORY
// ===============================
export const showCreateCategoryForm = (req, res) => {
  res.render("pages/new-category", { title: "New Category", errors: [], data: {} });
};

export const processCreateCategory = async (req, res) => {
  const { category_name } = req.body;
  if (!category_name || category_name.length < 3 || category_name.length > 100) {
    return res.render("pages/new-category", { title: "New Category", errors: ["Name must be 3-100 chars."], data: { category_name } });
  }
  try {
    await createCategory(category_name);
    res.redirect("/categories");
  } catch (error) {
    res.render("pages/new-category", { title: "New Category", errors: ["Database error."], data: { category_name } });
  }
};

// ===============================
// EDIT CATEGORY
// ===============================
export const showEditCategoryForm = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.render("pages/edit-category", { title: "Edit Category", category, errors: [] });
  } catch (error) {
    console.error("DEBUG ERROR:", error);
    res.status(500).send("Error loading edit page");
  }
};

export const processEditCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  if (!category_name || category_name.length < 3 || category_name.length > 100) {
    return res.render("pages/edit-category", { title: "Edit Category", category: { category_id: id, category_name }, errors: ["Name must be 3-100 chars."] });
  }
  try {
    await updateCategory(id, category_name);
    res.redirect("/categories");
  } catch (error) {
    res.render("pages/edit-category", { title: "Edit Category", category: { category_id: id, category_name }, errors: ["Database error."] });
  }
};