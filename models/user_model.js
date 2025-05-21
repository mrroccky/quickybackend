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

  // Get user by phone number
  static async getByPhoneNumber(phone_number) {
    try {
      const [rows] = await pool.query('SELECT user_id, first_name, last_name, email, phone_number, profile_image_url, gender, date_of_birth, address_line, city, state, country, postal_code, is_email_verified, is_phone_number_verified, created_at, last_login_at, account_status, preferred_language, is_premium_user, referral_code, referred_by FROM users WHERE phone_number = ? AND account_status = ?', [phone_number, 'active']);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Error fetching user by phone number: ' + error.message);
    }
  }

  // Create a new user
  static async create(data) {
    try {
      const {
        first_name, last_name, email, phone_number, password, profile_image_url,
        gender, date_of_birth, address_line, city, state, country, postal_code,
        is_email_verified, is_phone_number_verified, preferred_language,
        is_premium_user, referral_code, referred_by, last_login_at, account_status
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
      const createdAt = new Date().toISOString(); // Set current timestamp for first-time creation
      const finalAccountStatus = account_status || 'active';
      const finalLastLoginAt = last_login_at || null;
      const finalPreferredLanguage = preferred_language || 'en';
      const finalIsPremiumUser = is_premium_user || false;
      const finalReferredBy = referred_by || null;

      const [result] = await pool.query(
        `INSERT INTO users (
          first_name, last_name, email, phone_number, password, profile_image_url,
          gender, date_of_birth, address_line, city, state, country, postal_code,
          is_email_verified, is_phone_number_verified, created_at, last_login_at,
          account_status, preferred_language, is_premium_user, referral_code, referred_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name, last_name, email, phone_number, hashedPassword, profile_image_url,
          gender, date_of_birth, address_line, city, state, country, postal_code,
          is_email_verified || false, is_phone_number_verified || false, createdAt,
          finalLastLoginAt, finalAccountStatus, finalPreferredLanguage, finalIsPremiumUser,
          finalReferralCode, finalReferredBy
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in User.create:', {
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
      first_name, last_name, email, phone_number, password, profile_image_url,
      gender, date_of_birth, address_line, city, state, country, postal_code,
      is_email_verified, is_phone_number_verified, preferred_language,
      is_premium_user, referral_code, referred_by, last_login_at, account_status
    } = data;

    // Validate required fields
    if (first_name === undefined || last_name === undefined || email === undefined || phone_number === undefined) {
      throw new Error('Required fields (first_name, last_name, email, phone_number) cannot be undefined');
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Use provided values or keep existing for created_at and account_status
    const createdAt = data.created_at || null;
    const finalAccountStatus = account_status || 'active';

    const [result] = await pool.query(
      `UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone_number = COALESCE(?, phone_number),
        password = COALESCE(?, password),
        profile_image_url = COALESCE(?, profile_image_url),
        gender = COALESCE(?, gender),
        date_of_birth = COALESCE(?, date_of_birth),
        address_line = COALESCE(?, address_line),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        country = COALESCE(?, country),
        postal_code = COALESCE(?, postal_code),
        is_email_verified = COALESCE(?, is_email_verified),
        is_phone_number_verified = COALESCE(?, is_phone_number_verified),
        created_at = COALESCE(?, created_at),
        last_login_at = COALESCE(?, last_login_at),
        account_status = COALESCE(?, account_status),
        preferred_language = COALESCE(?, preferred_language),
        is_premium_user = COALESCE(?, is_premium_user),
        referral_code = COALESCE(?, referral_code),
        referred_by = COALESCE(?, referred_by)
      WHERE user_id = ? AND account_status = ?`,
      [
        first_name, last_name, email, phone_number, hashedPassword, profile_image_url,
        gender, date_of_birth, address_line, city, state, country, postal_code,
        is_email_verified, is_phone_number_verified, createdAt, last_login_at || null,
        finalAccountStatus, preferred_language, is_premium_user, referral_code, referred_by,
        id, 'active'
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