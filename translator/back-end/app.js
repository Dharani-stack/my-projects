require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/translate');


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api', routes); // Mount all routes under /api

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
