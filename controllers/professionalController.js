const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration for memory storage (Base64 handling)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
    }
  },
});

exports.getProfessionalByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const [rows] = await pool.query('SELECT * FROM professionals WHERE service_id = ?', [serviceId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching professionals by service ID:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProfessionals = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM professionals');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching all professionals:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createProfessional = async (req, res) => {
  try {
    const { service_id, user_id } = req.body;

    // Create professional with only service_id, user_id, and status
    // Bio, experience_years, and uploaded_file will be null initially
    const [result] = await pool.query(
      `INSERT INTO professionals (service_id, user_id, status, uploaded_file, bio, experience_years, created_at, money_earned)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [service_id, user_id, 'pending', null, null, null, 0.00]
    );

    res.status(201).json({
      professional_id: result.insertId,
      service_id,
      user_id,
      status: 'pending',
      uploaded_file: null,
      bio: null,
      experience_years: null,
      money_earned: 0.00,
      created_at: new Date(),
    });
  } catch (error) {
    console.error('Error creating professional:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfessional = [
  upload.single('uploaded_file'),
  async (req, res) => {
    try {
      console.log('Updating professional with data:', req.body);
      const { id } = req.params;
      const { status, bio, experience_years, availability, money_earned } = req.body;
      let uploaded_file = null;

      // Only set uploaded_file if a file is uploaded or explicitly provided
      if (req.file) {
        const base64String = req.file.buffer.toString('base64');
        uploaded_file = `data:${req.file.mimetype};base64,${base64String}`;
      } else if (req.body.uploaded_file && req.body.uploaded_file !== 'null') {
        uploaded_file = req.body.uploaded_file;
      }

      // Build dynamic update query
      const fields = [];
      const values = [];

      if (availability) {
        fields.push('availability = ?');
        values.push(availability);
      }
      if (status) {
        fields.push('status = ?');
        values.push(status);
      }
      if (uploaded_file) { // Only include if explicitly set
        fields.push('uploaded_file = ?');
        values.push(uploaded_file);
      }
      if (bio !== undefined) {
        fields.push('bio = ?');
        values.push(bio || null);
      }
      if (experience_years !== undefined) {
        fields.push('experience_years = ?');
        values.push(experience_years || null);
      }
      if (money_earned !== undefined) {
        fields.push('money_earned = money_earned + ?');
        values.push(money_earned);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(id);
      const query = `UPDATE professionals SET ${fields.join(', ')} WHERE professional_id = ?`;
      const [result] = await pool.query(query, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Professional not found' });
      }

      const [updatedRows] = await pool.query('SELECT * FROM professionals WHERE professional_id = ?', [id]);
      res.status(200).json(updatedRows[0]);
    } catch (error) {
      console.error('Error updating professional:', error);
      res.status(500).json({ error: error.message });
    }
  },
];

exports.deleteProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM professionals WHERE professional_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.status(200).json({ message: 'Professional deleted successfully' });
  } catch (error) {
    console.error('Error deleting professional:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfessionalByServiceId: exports.getProfessionalByServiceId,
  getAllProfessionals: exports.getAllProfessionals,
  createProfessional: exports.createProfessional,
  updateProfessional: exports.updateProfessional,
  deleteProfessional: exports.deleteProfessional,
};