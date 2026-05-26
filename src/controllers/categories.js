import {
  getAllCategories,
  getProjectCategories,
  updateCategoryAssignments
} from '../models/categories.js';

import {
  getCategoryById,
  getProjectsByCategoryId,
  getProjectDetails
} from '../models/projects.js';


// ===============================
// ALL CATEGORIES PAGE
// ===============================
const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("pages/categories", {
      title: "Categories",
      categories
    });

  } catch (error) {
    console.error("Error loading categories:", error);
    res.status(500).send("Internal server error");
  }
};


// ===============================
// CATEGORY DETAILS PAGE
// ===============================
const categoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("pages/category-details", {
      title: "Category Details",
      category,
      projects
    });

  } catch (error) {
    console.error("Error loading category details:", error);
    res.status(500).send("Internal server error");
  }
};


// ===============================
// SHOW ASSIGN CATEGORIES FORM
// ===============================
const showAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getProjectCategories(projectId);

    res.render("pages/assign-categories", {
      title: "Assign Categories",
      projectId,
      projectDetails,
      categories,
      assignedCategories
    });

  } catch (error) {
    console.error("Error loading assign form:", error);
    res.status(500).send("Internal server error");
  }
};


// ===============================
// PROCESS ASSIGN CATEGORIES FORM
// ===============================
const processAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    let categoryIds = req.body.categoryIds || [];

    // asegurar array
    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

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
// EXPORTS (ONLY ONCE)
// ===============================
export {
  showCategoriesPage,
  categoryDetails,
  showAssignCategoriesForm,
  processAssignCategoriesForm
};