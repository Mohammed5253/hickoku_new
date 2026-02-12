// This is a helper for product queries using MySQL
import pool from '../lib/mysql';

export async function getAllProducts({ category, name }: { category?: string; name?: string }) {
  let query = 'SELECT * FROM products';
  const params: any[] = [];
  const conditions: string[] = [];
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (name) {
    conditions.push('LOWER(name) LIKE ?');
    params.push(`%${name.toLowerCase()}%`);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(query, params);
  return rows;
}


export async function getProductById(id: number) {
  const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}
