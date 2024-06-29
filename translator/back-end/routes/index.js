const express = require('express');
const translateRoutes = require('./translate');

const router = express.Router();

// Use translate routes
router.use('/app', translateRoutes); // Ensure translateRoutes is correctly imported

module.exports = router;