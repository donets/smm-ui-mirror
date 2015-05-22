
var cache = null;

/**
* throws error
*/
function checkCacheImplementation() {
	if (cache === null) {
		throw new Error('Cannot use cache without cache implementation. Use init() first.');
	}
}

module.exports = {
	get: function(key) {
		checkCacheImplementation();
		return cache.get(key);
	},
	set: function(key, value) {
		checkCacheImplementation();
		return cache.set(key, value);
	},
	init: function(cacheImplementation) {
		cache = cacheImplementation;
	}
}
