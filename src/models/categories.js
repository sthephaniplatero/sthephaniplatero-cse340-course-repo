import db from './db.js';
export const getAllCategories = async () => {
    const query = "SELECT * FROM categories ORDER BY category_name ASC;";
    const result = await db.query(query);
    return result.rows;
};