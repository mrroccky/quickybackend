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

// Fetch all reviews for a professional with average rating and usernames
const findByProfessionalId = async (professional_id) => {
  const query = `
    SELECT urp.review_id, urp.booking_id, urp.user_id, urp.professional_id, urp.rating, urp.review_text, urp.created_at, 
           COALESCE(u.first_name, u.last_name, CAST(u.user_id AS CHAR)) AS username
    FROM user_reviews_professionals urp
    LEFT JOIN users u ON urp.user_id = u.user_id
    WHERE urp.professional_id = ?
  `;
  const [reviews] = await pool.execute(query, [professional_id]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
    : 0;

  return { averageRating, totalReviews, reviews };
};

// Fetch all reviews
const findAll = async () => {
  const query = `SELECT * FROM user_reviews_professionals`;
  const [rows] = await pool.execute(query);
  return rows;
};

// Fetch a single review by review_id
const findById = async (id) => {
  const query = `SELECT * FROM user_reviews_professionals WHERE review_id = ?`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

// Update a review
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

// Delete a review
const remove = async (id) => {
  const query = `DELETE FROM user_reviews_professionals WHERE review_id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  findAll,
  findById,
  findByProfessionalId,
  update,
  remove,
};
