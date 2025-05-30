const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create a new service review
const create = async ({ rating, comment, service_id, user_id, professional_id, booking_id }) => {
  const service_review_id = uuidv4();
  const query = `
    INSERT INTO service_review_table (service_review_id, rating, comment, created_at, service_id, user_id, professional_id, booking_id)
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
  `;
  const values = [service_review_id, rating, comment, service_id, user_id, professional_id, booking_id];
  const [result] = await pool.execute(query, values);
  return { service_review_id, rating, comment, service_id, user_id, professional_id, booking_id, created_at: new Date() };
};

// Other functions remain the same
const findAll = async () => {
  const query = `SELECT * FROM service_review_table`;
  const [rows] = await pool.execute(query);
  return rows;
};

const findById = async (id) => {
  const query = `SELECT * FROM service_review_table WHERE service_review_id = ?`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

const findByServiceId = async (service_id) => {
  const query = `
    SELECT sr.service_review_id, sr.rating, sr.comment, sr.created_at, sr.service_id, sr.user_id, sr.professional_id, sr.booking_id
    FROM service_review_table sr
    JOIN services s ON sr.service_id = s.service_id
    WHERE sr.service_id = ?
  `;
  const [rows] = await pool.execute(query, [service_id]);
  return rows;
};

const update = async (id, { rating, comment }) => {
  const query = `
    UPDATE service_review_table
    SET rating = ?, comment = ?
    WHERE service_review_id = ?
  `;
  const values = [rating, comment, id];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0 ? { service_review_id: id, rating, comment } : null;
};

const remove = async (id) => {
  const query = `DELETE FROM service_review_table WHERE service_review_id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  create,
  findAll,
  findById,
  findByServiceId,
  update,
  remove,
};