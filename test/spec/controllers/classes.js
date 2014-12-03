'use strict';

describe('Controller: ClassesCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var ClassesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClassesCtrl = $controller('ClassesCtrl', {
      $scope: scope
    });
  }));

});
