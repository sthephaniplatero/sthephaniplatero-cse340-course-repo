import { getAllCategories } from '../models/categories.js';

import {
  getCategoryById,
  getProjectsByCategoryId
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
    console.error("Error al cargar categorías:", error.message);
    res.status(500).send("Error interno del servidor");
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
    console.error("Error al cargar detalles de categoría:", error.message);
    res.status(500).send("Error interno del servidor");
  }
};


// ===============================
// EXPORTS
// ===============================
export {
  showCategoriesPage,
  categoryDetails
};