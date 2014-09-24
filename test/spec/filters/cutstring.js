'use strict';

describe('Filter: cutString', function () {

  // load the filter's module
  beforeEach(module('boltApp'));

  // initialize a new instance of the filter before each test
  var cutString;
  beforeEach(inject(function ($filter) {
    cutString = $filter('cutString');
  }));

});
