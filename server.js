const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const pool = require('./config/database');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

// Multer setup for parsing multipart/form-data (no files)
const upload = multer();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none()); // Parse multipart/form-data without files

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