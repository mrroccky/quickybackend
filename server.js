const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const pool = require('./config/database');
const apiRoutes = require('./routes/api');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Multer setup for parsing multipart/form-data (no files)
const upload = multer();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Qwicky Backend API');
});

// Check database connection
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

// Start server and check database connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  checkDatabaseConnection();
});