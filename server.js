const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/database');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
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
const PORT = process.env.PORT || 3000; // Changed to 3000 for clarity
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  checkDatabaseConnection();
});