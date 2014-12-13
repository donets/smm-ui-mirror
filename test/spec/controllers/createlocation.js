'use strict';

describe('Controller: CreateLocationCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var CreateLocationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateLocationCtrl = $controller('CreateLocationCtrl', {
      $scope: scope
    });
  }));

});
