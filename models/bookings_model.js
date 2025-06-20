const pool = require('../config/database');

class Booking {
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM bookings WHERE status != ?',
        ['cancelled']
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching bookings: ' + error.message);
    }
  }

  static async getPending(professionalId) {
    try {
      const [rows] = await pool.query(
        `SELECT b.*
         FROM bookings b
         LEFT JOIN booking_rejections br ON b.booking_id = br.booking_id AND br.professional_id = ?
         WHERE (b.status = 'pending' AND br.booking_id IS NULL AND b.professional_id IS NULL)
         OR (b.status = 'accepted' AND b.professional_id = ?)
         `,
        [professionalId, professionalId]
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching pending bookings: ' + error.message);
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM bookings WHERE booking_id = ? AND status != ?',
        [id, 'cancelled']
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Error fetching booking: ' + error.message);
    }
  }

  static async getByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          b.booking_id, b.service_id, b.user_id, b.professional_id, 
          b.scheduled_date, b.scheduled_time, b.booking_type, 
          b.status, b.payment_status, b.total_amount, 
          b.address_line, b.city, b.state, b.country, b.postal_code, 
          b.latitude, b.longitude, b.created_at, b.booking_pin,
          s.service_title, s.service_image
         FROM bookings b
         JOIN services s ON b.service_id = s.service_id
         WHERE b.user_id = ? AND b.status != ?`,
        [userId, 'cancelled']
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching bookings by user ID: ' + error.message);
    }
  }

  static async getUserIdByProfessionalId(professionalId) {
    try {
      const [rows] = await pool.query(
        `SELECT user_id 
         FROM professionals 
         WHERE professional_id = ?`,
        [professionalId]
      );
      return rows.length > 0 ? rows[0].user_id : null;
    } catch (error) {
      throw new Error('Error fetching user ID by professional ID: ' + error.message);
    }
  }

  static async getProfessionalByServiceId(serviceId) {
    try {
      const [rows] = await pool.query(
        `SELECT professional_id 
         FROM professionals 
         WHERE service_id = ?
         LIMIT 1`,
        [serviceId]
      );
      return rows.length > 0 ? rows[0].professional_id : null;
    } catch (error) {
      throw new Error('Error fetching professional by service ID: ' + error.message);
    }
  }

  static async create(data) {
    try {
      const {
        service_id, scheduled_date, scheduled_time, payment_status,
        total_amount, address_line, city, state, country, postal_code,
        latitude, longitude, user_id, professional_id, created_at
      } = data;

      const bookingPin = Math.floor(1000 + Math.random() * 9000).toString();

      const finalServiceId = service_id || null;
      const finalScheduledDate = scheduled_date || null;
      const finalScheduledTime = scheduled_time || null;
      const finalPaymentStatus = payment_status || 'pending';
      const finalTotalAmount = total_amount || null;
      const finalAddressLine = address_line || null;
      const finalCity = city || null;
      const finalState = state || null;
      const finalCountry = country || null;
      const finalPostalCode = postal_code || null;
      const finalLatitude = latitude || null;
      const finalLongitude = longitude || null;
      const finalUserId = user_id || null;
      const finalProfessionalId = professional_id || null; // Allow NULL for new bookings
      const finalCreatedAt = created_at || new Date().toISOString().slice(0, 19).replace('T', ' ');

      console.log('Generated PIN for booking:', bookingPin);

      const [result] = await pool.query(
        `INSERT INTO bookings (
          service_id, scheduled_date, scheduled_time, payment_status,
          total_amount, address_line, city, state, country, postal_code,
          latitude, longitude, user_id, professional_id, created_at, booking_pin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalServiceId, finalScheduledDate, finalScheduledTime, finalPaymentStatus,
          finalTotalAmount, finalAddressLine, finalCity, finalState, finalCountry,
          finalPostalCode, finalLatitude, finalLongitude, finalUserId,
          finalProfessionalId, finalCreatedAt, bookingPin
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in Booking.create:', {
        message: error.message,
        stack: error.stack,
        data
      });
      throw new Error('Error creating booking: ' + error.message);
    }
  }

  static async rejectBooking(bookingId, professionalId) {
    try {
      const [result] = await pool.query(
        'INSERT INTO booking_rejections (booking_id, professional_id) VALUES (?, ?)',
        [bookingId, professionalId]
      );
      return result.insertId > 0;
    } catch (error) {
      throw new Error('Error creating booking rejection: ' + error.message);
    }
  }

  static async update(id, data) {
    try {
      const {
        service_id, scheduled_date, scheduled_time, payment_status,
        total_amount, address_line, city, state, country, postal_code,
        latitude, longitude, user_id, professional_id, status
      } = data;

      const updateFields = [];
      const updateValues = [];

      if (service_id !== undefined) {
        updateFields.push('service_id = ?');
        updateValues.push(service_id);
      }
      if (scheduled_date !== undefined) {
        updateFields.push('scheduled_date = ?');
        updateValues.push(scheduled_date);
      }
      if (scheduled_time !== undefined) {
        updateFields.push('scheduled_time = ?');
        updateValues.push(scheduled_time);
      }
      if (payment_status !== undefined) {
        updateFields.push('payment_status = ?');
        updateValues.push(payment_status);
      }
      if (total_amount !== undefined) {
        updateFields.push('total_amount = ?');
        updateValues.push(total_amount);
      }
      if (address_line !== undefined) {
        updateFields.push('address_line = ?');
        updateValues.push(address_line);
      }
      if (city !== undefined) {
        updateFields.push('city = ?');
        updateValues.push(city);
      }
      if (state !== undefined) {
        updateFields.push('state = ?');
        updateValues.push(state);
      }
      if (country !== undefined) {
        updateFields.push('country = ?');
        updateValues.push(country);
      }
      if (postal_code !== undefined) {
        updateFields.push('postal_code = ?');
        updateValues.push(postal_code);
      }
      if (latitude !== undefined) {
        updateFields.push('latitude = ?');
        updateValues.push(latitude);
      }
      if (longitude !== undefined) {
        updateFields.push('longitude = ?');
        updateValues.push(longitude);
      }
      if (user_id !== undefined) {
        updateFields.push('user_id = ?');
        updateValues.push(user_id);
      }
      if (professional_id !== undefined) {
        updateFields.push('professional_id = ?');
        updateValues.push(professional_id === '' ? null : professional_id); 
      }
      if (status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }

      if (updateFields.length === 0) {
        throw new Error('No fields provided for update');
      }

      updateValues.push(id, 'cancelled');

      const query = `UPDATE bookings SET ${updateFields.join(', ')} WHERE booking_id = ? AND status != ?`;

      const [result] = await pool.query(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error updating booking: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query(
        'UPDATE bookings SET status = ? WHERE booking_id = ? AND status != ?',
        ['cancelled', id, 'cancelled']
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error deleting booking: ' + error.message);
    }
  }
}

module.exports = Booking;