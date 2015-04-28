'use strict';

describe('Controller: ClassfiltersCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var ClassfiltersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClassfiltersCtrl = $controller('ClassfiltersCtrl', {
      $scope: scope
    });
  }));

});
