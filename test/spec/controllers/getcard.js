'use strict';

describe('Controller: GetcardCtrl', function () {

  // load the controller's module
  beforeEach(module('boltApp'));

  var GetcardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GetcardCtrl = $controller('GetcardCtrl', {
      $scope: scope
    });
  }));

});
