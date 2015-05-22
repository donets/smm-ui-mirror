var Promise = require('bluebird'),
		config = require('../config/config'),
		request = Promise.promisifyAll(require('request')),
		_ = require('lodash'),
		cache = require('../cache/cache');

module.exports = function(req, res, next) {

	/**
	 * @param string cmsPageName
	 * @return promise
	 */
	function requestContent(cmsPageName) {
		return new Promise(function(resolve, reject) {
			// first request cache
			var cachedContent = cache.get('cms/' + cmsPageName);
			if (cachedContent) {
				return resolve(cachedContent);
			}
			// then make request
			request.getAsync(config.get('wordpressCms.restUrl') + '/posts?filter[name]=' + cmsPageName)
			// then put content from request to cache and resolve
			.then(function() {
				var cmsContent = getContent.apply(this, arguments);
				cache.set('cms/' + cmsPageName, cmsContent);
				return resolve(cmsContent);
			})
		});
	}

	/**
	 * get content from request response
	 *
	 * @param Object args
	 * @return String
	 */
	function getContent(args) {
		var response = args[0],
				body;

		try {
			body = JSON.parse(response.body);
			body = body[0];
		} catch (e) {
			console.error('cannot parse wordpress content');
			return '';
		}
		return body.content;
	}

	requestContent(req.param('cms'))
	.then(function(content) {
		res.send({
			content: content
		});
	})
	.catch(function() {
		console.error('error occurred');
		res.send({
			success: false,
			content: null
		});
	});
}
