var config = require('../config/config'),
    request = require('request'),
    Promise = require('bluebird'),
    Gettext = require('node-gettext'),
    fs = Promise.promisifyAll(require('fs')),
    translate = require('../translate/translate'),
    sprintf = require('sprintf').sprintf,
    validateResponse = require('./validateResponse')
    ;

module.exports = function(req, res, next, mainContent) {
	mainContent = mainContent || '';

	function guessLocation(host) {
		return new Promise(function(resolve, reject) {
			headers = config.get('useUserHostName') ? {'Host': host} : {};
			request({
				url: config.get('restUrlBase') + '/api/country/guess/config?guessCity=true',
				headers: headers
			}, function (error, response, body) {

				var json,
						resolveFallback = function() {
							resolve(
								config.get('fallbackLanguage'),
								config.get('fallbackCity'),
								config.get('fallbackUrl')
							);
						};

				if (error) {
					console.error('error during guess city request: ' + error);
					return resolveFallback();
				}

				try {
					json = JSON.parse(body);
				} catch (e) {
					console.error('cannot parse guess city request: ' + e.stack);
					return resolveFallback();
				}

				if (!validateResponse(json)) {
					return resolveFallback();
				}

				resolve(
					json.guessedCity.languageCode,
					json.guessedCity.defaultName,
					json.country.defaultDomain.absUrlBase
				);
			});
		});
	}

	function render(lang, city, url) {
		res.render('index/templates/index' + (config.get('isDev') ? '_dev' : ''), {
			restUrlBaseOld: config.get('restUrlBaseOld'),
			restUrlBase: config.get('restUrlBase'),
			fbClientId: config.get('fbClientId'),
			fbAppId: config.get('fbAppId'),
			title: translate(lang, "Somuchmore | Move Body, Mind and Soul"),
			description: translate(lang, sprintf(
				"Discover unlimited Yoga, Pilates, Fighting arts, Meditation, Dancing, Health, Nutrition and personal Freedom throughout %s.",
				city
			)),
			mainContent: function() {
        return mainContent;
      },
			url: url,
		});
	}

	guessLocation(req.headers.host)
	.then(render);
}
