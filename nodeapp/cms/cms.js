var Promise = require('bluebird'),
		config = require('../config/config'),
		request = Promise.promisifyAll(require('request')),
		_ = require('lodash');

module.exports = function(req, res, next) {
	function getCmsNameFromUrl(url) {
		if (url[url.length - 1] === '/') {
			url = url.substring(0, url.length - 1);
		}
		var urlParts = url.split('/');
		return urlParts[url.split.length];
	}

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

	var cmsPageName = req.param('cms');

	request.getAsync(config.get('wordpressCms.restUrl') + '/posts?filter[name]=' + cmsPageName)
	.then(getContent)
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
