'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Reset', [])
    .controller('ResetCtrl', [ '$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {
        $scope.resetPassword = function () {
            $scope.loadingReset = true;
            $scope.errorReset = false;
            $http.get($window.smmConfig.restUrlBase + '/api/auth/changePasswordWithTokenAndLogin?token=' + $rootScope.$stateParams.token + '&newPassword=' + this.passwordReset).success(function (response) {
                console.log(response);
                $scope.loadingReset = false;
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
                $scope.loadingReset = false;
                $scope.errorReset = true;
                $scope.errorMessage = response.type;
            });
        };
    }]);
