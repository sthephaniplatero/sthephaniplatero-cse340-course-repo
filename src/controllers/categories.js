import { getAllCategories } from '../models/categories.js';


const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render("pages/categories", { title: "Categories", categories });
  } catch (error) {
    console.error("Error al cargar categorías:", error.message);
    res.status(500).send("Error interno del servidor");
  }
};

export { showCategoriesPage };
