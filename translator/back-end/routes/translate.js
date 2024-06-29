const express = require('express');
const router = express.Router();
const textTranslatorController = require('../controllers/textTranslator');

// Translate route
router.post('/translate', textTranslatorController.translateHandler);

// Supported languages route
router.get('/supported-languages', textTranslatorController.supportedLanguagesHandler);

module.exports = router;
