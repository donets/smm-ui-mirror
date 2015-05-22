
var NodeCache = require('./nodecache'),
		expect = require('chai').expect;

describe('nodecache test', function() {

	it('caches', function() {
		var nodecache = NodeCache(100)
		nodecache.set('test', 'florian');
		expect(nodecache.get('test')).to.equal('florian');
	});

	it('expires', function(done) {
		this.timeout(3000);
		var nodecache = NodeCache(1, 0.5);
		nodecache.set('test', 'florian');
		setTimeout(function() {
			expect(nodecache.get('test')).not.to.equal('florian');
			done();
		}, 2000);
	});

});
