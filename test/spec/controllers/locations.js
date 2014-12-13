'use strict';

describe('Controller: LocationsCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var LocationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LocationsCtrl = $controller('LocationsCtrl', {
      $scope: scope
    });
  }));

});
