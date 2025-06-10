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
      const { service_id, user_id, status, uploaded_file, bio, experience_years } = data;
      const [result] = await pool.query(
        'INSERT INTO professionals (service_id, user_id, status, uploaded_file, bio, experience_years, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [
          service_id || null,
          user_id || null,
          status || 'pending',
          uploaded_file || null,
          bio || null,
          experience_years || null,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating professional: ' + error.message);
    }
  },

  update: async (id, data) => {
    try {
      const { status, uploaded_file, service_id, user_id, bio, experience_years } = data;
      const fields = [];
      const values = [];

      if (status) {
        fields.push('status = ?');
        values.push(status);
      }
      if (uploaded_file !== undefined) {
        fields.push('uploaded_file = ?');
        values.push(uploaded_file);
      }
      if (service_id) {
        fields.push('service_id = ?');
        values.push(service_id);
      }
      if (user_id) {
        fields.push('user_id = ?');
        values.push(user_id);
      }
      if (bio !== undefined) {
        fields.push('bio = ?');
        values.push(bio || null);
      }
      if (experience_years !== undefined) {
        fields.push('experience_years = ?');
        values.push(experience_years || null);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      const query = `UPDATE professionals SET ${fields.join(', ')} WHERE professional_id = ?`;
      const [result] = await pool.query(query, values);

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