require('../config/config').read(__dirname + '/../config/config.json');

var translate = require('./translate'),
    expect = require('chai').expect;



describe('translation test', function() {
  it('translates to de', function() {
    expect(translate('de', 'Beginners')).to.equal('Anfänger');
  });

  it('translates to unknown', function() {
    expect(translate('et', 'Beginners')).to.equal('Beginners');
  });
});
