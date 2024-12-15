const express = require('express');
const cors = require('cors');
const db = require('./models'); // Import Sequelize models

const app = express();
require('dotenv').config(); // Load environment variables

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection and sync models
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.sequelize.sync({ alter: true }) // Sync Sequelize models to the database
  .then(() => {
    console.log('Database synced with Sequelize models.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Default route for testing
app.get('/', (req, res) => {
  res.send('Carpooling System Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
