const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create a new payment
const create = async ({ booking_id, payment_method, transaction_id, amount, status, user_id }) => {
  const payment_id = uuidv4();
  const query = `
    INSERT INTO payment_table (payment_id, booking_id, payment_method, transaction_id, amount, status, created_at, user_id)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
  `;
  const values = [payment_id, booking_id, payment_method, transaction_id, amount, status, user_id];
  const [result] = await pool.execute(query, values);
  return { payment_id, booking_id, payment_method, transaction_id, amount, status, user_id, created_at: new Date() };
};

// Get all payments
const findAll = async () => {
  const query = `SELECT * FROM payment_table`;
  const [rows] = await pool.execute(query);
  return rows;
};

// Get a payment by ID
const findById = async (id) => {
  const query = `SELECT * FROM payment_table WHERE payment_id = ?`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

// Update a payment
const update = async (id, { payment_method, transaction_id, amount, status }) => {
  const query = `
    UPDATE payment_table
    SET payment_method = ?, transaction_id = ?, amount = ?, status = ?
    WHERE payment_id = ?
  `;
  const values = [payment_method, transaction_id, amount, status, id];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0 ? { payment_id: id, payment_method, transaction_id, amount, status } : null;
};

// Delete a payment
const remove = async (id) => {
  const query = `DELETE FROM payment_table WHERE payment_id = ?`;
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