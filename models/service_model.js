const pool = require('../config/database');

class Service {
  // Helper method to safely parse JSON
  static safeJSONParse(jsonString, fallback = []) {
    if (!jsonString) return fallback;
    
    try {
      // Check if it's already an object/array
      if (typeof jsonString === 'object') {
        return jsonString;
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      console.warn('JSON parsing failed for:', jsonString, 'Error:', error.message);
      
      // If it's a string that failed to parse, treat it as plain text
      if (typeof jsonString === 'string') {
        // Convert plain text to array format
        return [jsonString];
      }
      
      return fallback;
    }
  }

  // Get all active services
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM services WHERE is_active = TRUE');
      return rows.map(row => ({
        ...row,
        description: this.safeJSONParse(row.description, []),
        main_description: this.safeJSONParse(row.main_description, [])
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
        description: this.safeJSONParse(service.description, []),
        main_description: this.safeJSONParse(service.main_description, [])
      };
    } catch (error) {
      throw new Error('Error fetching service: ' + error.message);
    }
  }

  // Helper method to ensure data is properly formatted for storage
  static formatForStorage(data) {
    if (typeof data === 'string') {
      try {
        // If it's already a JSON string, validate it
        JSON.parse(data);
        return data;
      } catch {
        // If it's plain text, convert to JSON array
        return JSON.stringify([data]);
      }
    } else if (Array.isArray(data) || typeof data === 'object') {
      return JSON.stringify(data);
    }
    return JSON.stringify([]);
  }

  // Create a new service
  static async create(data) {
    try {
      const { service_title, description, main_description, service_type, service_price, service_duration, category_id, service_image, location, commission_money } = data;
      const [result] = await pool.query(
        'INSERT INTO services (service_title, description, main_description, service_type, service_price, service_duration, category_id, service_image, location, commission_money, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          service_title, 
          this.formatForStorage(description), 
          this.formatForStorage(main_description), 
          service_type, 
          service_price, 
          service_duration, 
          category_id, 
          service_image, 
          location || null, 
          commission_money || 0.00,
          true
        ]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating service: ' + error.message);
    }
  }

  // Update a service
  static async update(id, data) {
    try {
      const { service_title, description, main_description, service_type, service_price, service_duration, category_id, service_image, location, commission_money } = data;
      const [result] = await pool.query(
        'UPDATE services SET service_title = ?, description = ?, main_description = ?, service_type = ?, service_price = ?, service_duration = ?, category_id = ?, service_image = ?, location = ?, commission_money = ? WHERE service_id = ? AND is_active = TRUE',
        [
          service_title, 
          this.formatForStorage(description), 
          this.formatForStorage(main_description), 
          service_type, 
          service_price, 
          service_duration, 
          category_id, 
          service_image, 
          location || null, 
          commission_money || 0.00,
          id
        ]
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