'use strict';

describe('Service: occurrences', function () {

  // load the service's module
  beforeEach(module('boltApp'));

  // instantiate service
  var occurrences;
  beforeEach(inject(function (_occurrences_) {
    occurrences = _occurrences_;
  }));

  it('should do something', function () {
    expect(!!occurrences).toBe(true);
  });

});
