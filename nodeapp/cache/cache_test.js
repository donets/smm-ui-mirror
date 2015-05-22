
var cache = require('./cache'),
		expect = require('chai').expect;

describe('cache test', function() {

	it('throws without implementation', function() {
		expect(cache.get).to.throw(Error);
	});

	it('uses a cache implementation', function() {
		var cacheMock = {
			set: function(key, value) {
				this[key] = value;
			},
			get: function(key) {
				return this[key];
			}
		};
		
		cache.init(cacheMock);
		cache.set('test', 'florian');

		expect(cache.get('test')).to.equal('florian');
	})

});
