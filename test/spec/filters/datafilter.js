'use strict';

describe('Filter: dataFilter', function () {

  // load the filter's module
  beforeEach(module('boltApp'));

  // initialize a new instance of the filter before each test
  var dataFilter;
  beforeEach(inject(function ($filter) {
    dataFilter = $filter('dataFilter');
  }));

});
