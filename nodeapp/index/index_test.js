var request = require('supertest')('http://localhost:5000'),
    config = require('../config/config').read(__dirname + '/../config/config.json'),
    expect = require('chai').expect;

describe('index test', function() {
  it('requests index', function(done) {
    request
    .get('/index.html')
    .end(function(err, res){
        if (err) return done(err);
        expect(res.text).to.contain(config.get('fbAppId'));
        expect(res.text).to.contain(config.get('restUrlBase'));
        done();
    });
  });
});
