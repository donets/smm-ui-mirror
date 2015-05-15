var Gettext = require('node-gettext'),
    fs = require('fs'),
    gt = new Gettext,
    config = require('../config/config'),
    isFallbackLanguageLoaded = false;

module.exports = function(lang, string) {
  var translatedText = null;

  lang = lang.toLowerCase();

  function getLangPath() {
    return __dirname
    + '/../../po/translations/'
    + lang
    + '/custom_' + lang + '.po'
  }

  function loadLanguageTokens() {
    var path = getLangPath();
    if (!fs.existsSync(path)) {
      console.error("path not exists: " + path);
      return;
    }
    gt.addTextdomain(lang, fs.readFileSync(path, 'utf8'));
  }

  if (!gt.textdomain(lang)) {
    loadLanguageTokens(lang);
  }

  return gt.dgettext(lang, string);
}
