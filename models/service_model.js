const pool = require('../config/database');

class Service {
  // Get all active services
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM services WHERE is_active = TRUE');
      return rows.map(row => ({
        ...row,
        description: JSON.parse(row.description)
      }));
    } catch (error) {
      throw new Error('Error fetching services: ' + error.message);
    }
  }

  // Get service by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM services WHERE service_id = ? AND is_active = TRUE', [id]);
      if (rows.length === 0) return null;
      
      const service = rows[0];
      return {
        ...service,
        description: JSON.parse(service.description)
      };
    } catch (error) {
      throw new Error('Error fetching service: ' + error.message);
    }
  }

  // Create a new service
  static async create(data) {
    try {
      const { service_title, description, service_type, service_price, service_duration, category_id, service_image, location } = data;
      const [result] = await pool.query(
        'INSERT INTO services (service_title, description, service_type, service_price, service_duration, category_id, service_image, location, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [service_title, JSON.stringify(description), service_type, service_price, service_duration, category_id, service_image, location || null, true]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating service: ' + error.message);
    }
  }

  // Update a service
  static async update(id, data) {
    try {
      const { service_title, description, service_type, service_price, service_duration, category_id, service_image, location } = data;
      const [result] = await pool.query(
        'UPDATE services SET service_title = ?, description = ?, service_type = ?, service_price = ?, service_duration = ?, category_id = ?, service_image = ?, location = ? WHERE service_id = ? AND is_active = TRUE',
        [service_title, JSON.stringify(description), service_type, service_price, service_duration, category_id, service_image, location || null, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error updating service: ' + error.message);
    }
  }

  // Soft delete a service
  static async delete(id) {
    try {
      const [result] = await pool.query('UPDATE services SET is_active = FALSE WHERE service_id = ? AND is_active = TRUE', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error deleting service: ' + error.message);
    }
  }

  // Get professional by service ID
  static async getProfessionalByServiceId(serviceId) {
    try {
      const [rows] = await pool.query('SELECT professional_id FROM professionals WHERE service_id = ? LIMIT 1', [serviceId]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0].professional_id;
    } catch (error) {
      throw new Error('Error fetching professional by service ID: ' + error.message);
    }
  }
}

module.exports = Service;