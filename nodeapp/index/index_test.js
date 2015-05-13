var request = require('supertest')('http://localhost:5000');

describe('index test', function() {
  it('requests index', function(done) {
    request
    .get('/index.html')
    .expect(200)
    .end(function(err) {
      console.log(arguments);
      done();
    });
  });
});
