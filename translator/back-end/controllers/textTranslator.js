const translateService = require('../services/textTranslateService');

async function translateHandler(req, res) {
  const { text, fromLanguage, toLanguage } = req.body;

  try {
    const translation = await translateService.translateText(text, fromLanguage, toLanguage);
   
    res.status(200).json({ translation });
    
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
}

function supportedLanguagesHandler(req, res) {
  try {
    const supportedLanguages = translateService.getSupportedLanguages();
    res.json({ supportedLanguages });
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    res.status(500).json({ error: 'Failed to fetch supported languages' });
  }
}

module.exports = {
  translateHandler,
  supportedLanguagesHandler,
};
