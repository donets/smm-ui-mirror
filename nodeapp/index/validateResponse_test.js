var validateResponse = require('./validateResponse'),
    expect = require('chai').expect;



describe('validate response test', function() {
  it('fails without guessedCity', function() {
    expect(validateResponse({})).to.be.false;
  });
  it('fails without country', function() {
    expect(validateResponse({guessedCity: {}})).to.be.false;
  });
  it('fails without country.defaultDomain', function() {
    expect(validateResponse({guessedCity: {}, country:{}})).to.be.false;
  });
  it('fails without country.defaultDomain.absUrlBase', function() {
    expect(validateResponse({
      guessedCity: {},
      country:{
        defaultDomain: {

        }
      }
    })).to.be.false;
  });
  it('succeeds', function() {
    expect(validateResponse({
      guessedCity: {},
      country: {
        defaultDomain: {
          absUrlBase: 'http://so-much-more.de'
        }
      }
    })).to.be.true;
  });
});
