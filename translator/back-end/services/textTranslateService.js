const translator = require("open-google-translator");

// Function to fetch supported languages
function getSupportedLanguages() {
  return translator.supportedLanguages();
}

// Function to translate text
async function translateText(text, fromLanguage, toLanguage) {
  try {
    const translationData = await translator.TranslateLanguageData({
      listOfWordsToTranslate: [text],
      fromLanguage,
      toLanguage,
    });
    console.log(translationData[0].translation)
    return translationData[0].translation;
    
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

module.exports = {
  getSupportedLanguages,
  translateText,
};
