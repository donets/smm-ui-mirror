'use strict';

describe('Controller: StudiosCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var StudiosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudiosCtrl = $controller('StudiosCtrl', {
      $scope: scope
    });
  }));

});
