const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  // Get all active users
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT user_id, first_name, last_name, email, phone_number, profile_image_url, gender, date_of_birth, address_line, city, state, country, postal_code, is_email_verified, is_phone_number_verified, created_at, last_login_at, account_status, preferred_language, is_premium_user, referral_code, referred_by, service_items_id FROM users WHERE account_status = ?',
        ['active']
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT user_id, first_name, last_name, email, phone_number, profile_image_url, gender, date_of_birth, address_line, city, state, country, postal_code, is_email_verified, is_phone_number_verified, created_at, last_login_at, account_status, preferred_language, is_premium_user, referral_code, referred_by, service_items_id FROM users WHERE user_id = ? AND account_status = ?',
        [id, 'active']
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  // Get user by phone number
  static async getByPhoneNumber(phone_number) {
    try {
      const [rows] = await pool.query(
        'SELECT user_id, first_name, last_name, email, phone_number, profile_image_url, gender, date_of_birth, address_line, city, state, country, postal_code, is_email_verified, is_phone_number_verified, created_at, last_login_at, account_status, preferred_language, is_premium_user, referral_code, referred_by, service_items_id FROM users WHERE phone_number = ? AND account_status = ?',
        [phone_number, 'active']
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Error fetching user by phone number: ' + error.message);
    }
  }

  // Create a new user
  static async create(data) {
    try {
      const {
        first_name,last_name,email,phone_number,password,profile_image_url,gender,date_of_birth,address_line,city,state,country,postal_code,is_email_verified,is_phone_number_verified,preferred_language,is_premium_user,referral_code,referred_by,last_login_at,account_status,service_items_id
      } = data;

      // Validate required fields
      if (!first_name || !last_name || !email || !phone_number || !password) {
        throw new Error('Missing required fields: first_name, last_name, email, phone_number, or password');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate unique referral code if not provided
      const finalReferralCode = referral_code && referral_code.trim() !== '' ? referral_code : null;

      // Set defaults for optional fields
      const createdAt = new Date().toISOString();
      const finalAccountStatus = account_status || 'active';
      const finalLastLoginAt = last_login_at || null;
      const finalPreferredLanguage = preferred_language || 'en';
      const finalIsPremiumUser = is_premium_user || false;
      const finalReferredBy = referred_by || null;
      const finalServiceItemsId = service_items_id || JSON.stringify([]); // Default to empty array

      const [result] = await pool.query(
        `INSERT INTO users (
          first_name, last_name, email, phone_number, password, profile_image_url,
          gender, date_of_birth, address_line, city, state, country, postal_code,
          is_email_verified, is_phone_number_verified, created_at, last_login_at,
          account_status, preferred_language, is_premium_user, referral_code, referred_by, service_items_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,last_name,email,phone_number,hashedPassword,profile_image_url,gender,date_of_birth,address_line,city,state,country,postal_code,is_email_verified || false,is_phone_number_verified || false,createdAt,finalLastLoginAt,finalAccountStatus,finalPreferredLanguage,finalIsPremiumUser,finalReferralCode,finalReferredBy,finalServiceItemsId
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Err User.create:', {
        message: error.message,
        stack: error.stack,
        data: data
      });
      throw new Error('Error creating user: ' + error.message);
    }
  }

  static async update(id, data) {
    try {
      const {
        first_name,last_name,email,phone_number,password,profile_image_url,gender,date_of_birth,address_line,city,state,country,postal_code,is_email_verified,is_phone_number_verified,preferred_language,is_premium_user,referral_code,referred_by,last_login_at,account_status,service_items_id
      } = data;

      // Only validate fields that are being updated (not undefined)
      // This allows partial updates without requiring all fields
      
      // Hash password if provided
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      // Build dynamic query based on provided fields
      const updateFields = [];
      const updateValues = [];

      if (first_name !== undefined) {
        updateFields.push('first_name = ?');
        updateValues.push(first_name);
      }
      if (last_name !== undefined) {
        updateFields.push('last_name = ?');
        updateValues.push(last_name);
      }
      if (email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (phone_number !== undefined) {
        updateFields.push('phone_number = ?');
        updateValues.push(phone_number);
      }
      if (hashedPassword !== undefined) {
        updateFields.push('password = ?');
        updateValues.push(hashedPassword);
      }
      if (profile_image_url !== undefined) {
        updateFields.push('profile_image_url = ?');
        updateValues.push(profile_image_url);
      }
      if (gender !== undefined) {
        updateFields.push('gender = ?');
        updateValues.push(gender);
      }
      if (date_of_birth !== undefined) {
        updateFields.push('date_of_birth = ?');
        updateValues.push(date_of_birth);
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
      if (is_email_verified !== undefined) {
        updateFields.push('is_email_verified = ?');
        updateValues.push(is_email_verified);
      }
      if (is_phone_number_verified !== undefined) {
        updateFields.push('is_phone_number_verified = ?');
        updateValues.push(is_phone_number_verified);
      }
      if (last_login_at !== undefined) {
        updateFields.push('last_login_at = ?');
        updateValues.push(last_login_at);
      }
      if (account_status !== undefined) {
        updateFields.push('account_status = ?');
        updateValues.push(account_status);
      }
      if (preferred_language !== undefined) {
        updateFields.push('preferred_language = ?');
        updateValues.push(preferred_language);
      }
      if (is_premium_user !== undefined) {
        updateFields.push('is_premium_user = ?');
        updateValues.push(is_premium_user);
      }
      if (referral_code !== undefined) {
        updateFields.push('referral_code = ?');
        updateValues.push(referral_code);
      }
      if (referred_by !== undefined) {
        updateFields.push('referred_by = ?');
        updateValues.push(referred_by);
      }
      if (service_items_id !== undefined) {
        updateFields.push('service_items_id = ?');
        updateValues.push(service_items_id);
      }

      // If no fields to update, return false
      if (updateFields.length === 0) {
        throw new Error('No fields provided for update');
      }

      // Add WHERE clause parameters
      updateValues.push(id, 'active');

      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ? AND account_status = ?`;

      const [result] = await pool.query(query, updateValues);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }

  // Soft delete a user
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET account_status = ? WHERE user_id = ? AND account_status = ?',
        ['inactive', id, 'active']
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
}

module.exports = User;