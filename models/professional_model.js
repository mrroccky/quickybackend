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
  },

  update: async (id, data) => {
    try {
      const [result] = await pool.query(
        'UPDATE professionals SET service_id = ?, user_id = ? WHERE professional_id = ?',
        [data.service_id, data.user_id, id]
      );
      if (result.affectedRows === 0) return null;
      const [rows] = await pool.query('SELECT * FROM professionals WHERE professional_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error updating professional: ' + error.message);
    }
  },

  delete: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM professionals WHERE professional_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error deleting professional: ' + error.message);
    }
  },

  getProfessionalByServiceId: async (serviceId) => {
  try {
    const query = `
      SELECT professional_id 
      FROM professionals
      WHERE service_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [serviceId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0].professional_id;
  } catch (error) {
    throw new Error('Error fetching professional by service ID: ' + error.message);
  }
},
};

module.exports = Professional;