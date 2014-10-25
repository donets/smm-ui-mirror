'use strict';

describe('Service: Suppliers', function () {

  // load the service's module
  beforeEach(module('boltApp'));

  // instantiate service
  var Suppliers;
  beforeEach(inject(function (_Suppliers_) {
    Suppliers = _Suppliers_;
  }));

  it('should do something', function () {
    expect(!!Suppliers).toBe(true);
  });

});
