var request = require('supertest')('http://localhost:5000'),
    config = require('../config/config').read(__dirname + '/../config/config.json'),
    expect = require('chai').expect;

describe('cms test', function() {
  it('requests cms', function(done) {
    request
    .get('/p/faq/')
    .end(function(err, res) {
        if (err) return done(err);
				done();
				console.log(res.text);
    });
  });
});
