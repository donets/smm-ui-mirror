'use strict';

describe('Controller: ResetCtrl', function () {

    // load the controller's module
    beforeEach(module('boltApp'));

    var ResetCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ResetCtrl = $controller('ResetCtrl', {
            $scope: scope
        });
    }));

});
