'use strict';

describe('Controller: ReservationsCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var ReservationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReservationsCtrl = $controller('ReservationsCtrl', {
      $scope: scope
    });
  }));

});