const pool = require('../config/database');

const Professional = {
  getAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM professionals');
      return rows;
    } catch (error) {
      throw new Error('Error fetching professionals: ' + error.message);
    }
  },

  create: async (data) => {
    try {
      const { service_id, user_id } = data;
      const [result] = await pool.query(
        'INSERT INTO professionals (service_id, user_id) VALUES (?, ?)',
        [service_id || null, user_id || null]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating professional: ' + error.message);
    }
  }
};

module.exports = Professional;