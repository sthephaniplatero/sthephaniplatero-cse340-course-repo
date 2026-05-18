const organizationsPage = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("pages/organizations", {
      title: "Our Partner Organizations",
      organizations
    });
  } catch (error) {
    console.error("Error al obtener organizaciones:", error);
    res.status(500).render("pages/404", { 
      title: "Error 500", 
      message: "Error al cargar organizaciones" 
    });
  }
};