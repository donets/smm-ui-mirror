'use strict';

describe('Controller: StudioCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var StudioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudioCtrl = $controller('StudioCtrl', {
      $scope: scope
    });
  }));

});
