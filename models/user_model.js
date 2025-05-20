const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  // Get all active users
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT user_id, first_name, last_name, email, phone_number, profile_image_url, gender, date_of_birth, address_line, city, state, country, postal_code, is_email_verified, is_phone_number_verified, created_at, last_login_at, account_status, preferred_language, is_premium_user, referral_code, referred_by FROM users WHERE account_status = ?', ['active']);
      return rows;
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT user_id, first_name, last_name, email, phone_number, profile_image_url, gender, date_of_birth, address_line, city, state, country, postal_code, is_email_verified, is_phone_number_verified, created_at, last_login_at, account_status, preferred_language, is_premium_user, referral_code, referred_by FROM users WHERE user_id = ? AND account_status = ?', [id, 'active']);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  // Create a new user
  static async create(data) {
    try {
      const {
        first_name, last_name, email, phone_number, password, profile_image_url,
        gender, date_of_birth, address_line, city, state, country, postal_code,
        is_email_verified, is_phone_number_verified, preferred_language,
        is_premium_user, referral_code, referred_by
      } = data;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate unique referral code if not provided
    
      const finalReferralCode = referral_code || `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      const [result] = await pool.query(
        `INSERT INTO users (
          first_name, last_name, email, phone_number, password, profile_image_url,
          gender, date_of_birth, address_line, city, state, country, postal_code,
          is_email_verified, is_phone_number_verified, account_status,
          preferred_language, is_premium_user, referral_code, referred_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name, last_name, email, phone_number, hashedPassword, profile_image_url,
          gender, date_of_birth, address_line, city, state, country, postal_code,
          is_email_verified || false, is_phone_number_verified || false, 'active',
          preferred_language, is_premium_user || false, finalReferralCode, referred_by
        ]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  // Update a user
  static async update(id, data) {
    try {
      const {
        first_name, last_name, email, phone_number, password, profile_image_url,
        gender, date_of_birth, address_line, city, state, country, postal_code,
        is_email_verified, is_phone_number_verified, preferred_language,
        is_premium_user, referral_code, referred_by
      } = data;

      // Hash password if provided
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      const [result] = await pool.query(
        `UPDATE users SET
          first_name = ?, last_name = ?, email = ?, phone_number = ?,
          password = COALESCE(?, password), profile_image_url = ?,
          gender = ?, date_of_birth = ?, address_line = ?, city = ?,
          state = ?, country = ?, postal_code = ?,
          is_email_verified = ?, is_phone_number_verified = ?,
          preferred_language = ?, is_premium_user = ?, referral_code = ?, referred_by = ?
        WHERE user_id = ? AND account_status = ?`,
        [
          first_name, last_name, email, phone_number, hashedPassword, profile_image_url,
          gender, date_of_birth, address_line, city, state, country, postal_code,
          is_email_verified, is_phone_number_verified, preferred_language,
          is_premium_user, referral_code, referred_by, id, 'active'
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }

  // Soft delete a user
  static async delete(id) {
    try {
      const [result] = await pool.query('UPDATE users SET account_status = ? WHERE user_id = ? AND account_status = ?', ['inactive', id, 'active']);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
}

module.exports = User;