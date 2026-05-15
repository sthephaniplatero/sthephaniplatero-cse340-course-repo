import db from './db.js';

/**
 * Recupera todos los proyectos de servicio, incluyendo el nombre 
 * de la organización que los patrocina mediante un JOIN.
 */
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.project_date, 
            o.name AS organization_name
        FROM service_projects p
        JOIN organizations o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;

    try {
        const result = await db.query(query);
        
        // Verificamos si hay resultados en la consola para depuración
        console.log(`Se recuperaron ${result.rows.length} proyectos con éxito.`);
        
        return result.rows;
    } catch (error) {
        // Capturamos errores de SQL (como tablas que no existen o errores de sintaxis)
        console.error("Error en la consulta getAllProjects:", error.message);
        throw error; // Lanzamos el error para que server.js lo maneje
    }
};

export { getAllProjects };