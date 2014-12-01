'use strict';

describe('Service: Membership', function () {

  // load the service's module
  beforeEach(module('boltApp'));

  // instantiate service
  var Membership;
  beforeEach(inject(function (_Membership_) {
    Membership = _Membership_;
  }));

  it('should do something', function () {
    expect(!!Membership).toBe(true);
  });

});
