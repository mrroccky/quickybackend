const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create a new user review for a professional
const create = async ({ booking_id, user_id, professional_id, rating, review_text }) => {
  const review_id = uuidv4();
  const query = `
    INSERT INTO user_reviews_professionals (review_id, booking_id, user_id, professional_id, rating, review_text, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const values = [review_id, booking_id, user_id, professional_id, rating, review_text];
  const [result] = await pool.execute(query, values);
  return { review_id, booking_id, user_id, professional_id, rating, review_text, created_at: new Date() };
};

// Other functions remain the same
const findAll = async () => {
  const query = `SELECT * FROM user_reviews_professionals`;
  const [rows] = await pool.execute(query);
  return rows;
};

const findById = async (id) => {
  const query = `SELECT * FROM user_reviews_professionals WHERE review_id = ?`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

const update = async (id, { rating, review_text }) => {
  const query = `
    UPDATE user_reviews_professionals
    SET rating = ?, review_text = ?
    WHERE review_id = ?
  `;
  const values = [rating, review_text, id];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0 ? { review_id: id, rating, review_text } : null;
};

const remove = async (id) => {
  const query = `DELETE FROM user_reviews_professionals WHERE review_id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};