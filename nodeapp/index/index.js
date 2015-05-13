var swig = require('swig'),
    config = require('../config/config'),
    request = require('request'),
    Promise = require('bluebird');

module.exports = function(req, res, next) {

    function guessLanguage(host) {
      return new Promise(function(resolve, reject) {
        headers = config.get('useUserHostName') ? {'Host': host} : {};
        request({
          url: config.get('restUrlBase') + '/api/country/guess/config?guessCity=true',
          headers: headers
        }, function (error, response, body) {
          body = body || {};
          if (error || !body.guessedCity) {
            return resolve(config.get('fallbackLanguage'));
          }

          resolve(body.guessedCity.languageCode);
        });
      });
    }

    function loadTokens(languageCode) {

    }

    function render() {
      var tpl = swig.compileFile(__dirname + '/index.html', {
        varControls: ['<%=', '=%>'],
        tagControls: ['<%', '%>']
      });

      res.send(tpl({
        restUrlBaseOld: config.get('restUrlBaseOld'),
        restUrlBase: config.get('restUrlBase'),
        fbClientId: config.get('fbClientId')
      }));
    };

    guessLanguage()
    .then(loadTokens)
    .then(render)
};
