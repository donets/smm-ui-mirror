
var NodeCache = require("node-cache"),
		cache = null;

module.exports = function(ttl, checkPeriod) {
	checkPeriod = checkPeriod || 120;

	cache = new NodeCache({
		stdTTL: ttl,
		checkperiod: checkPeriod
	});

	return {
		set: function(key, value) {
			cache.set(key, value);
		},
		get: function(key) {
			return cache.get(key);
		}
	}
}
