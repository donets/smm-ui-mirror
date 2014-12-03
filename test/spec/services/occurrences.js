'use strict';

describe('Service: Occurrences', function () {

  // load the service's module
  beforeEach(module('boltApp'));

  // instantiate service
  var Occurrences;
  beforeEach(inject(function (_Occurrences_) {
    Occurrences = _Occurrences_;
  }));

  it('should do something', function () {
    expect(!!Occurrences).toBe(true);
  });

});
